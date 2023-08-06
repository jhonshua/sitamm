// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall, CREATE, DELETE, FIND, UPDATE } from '../../../../service/api'
import { toast } from 'react-hot-toast'
// ** Axios Imports
import axios from 'axios'

export const setLoader = createAsyncThunk('appUsers/setLoader', value => {
  return {
    value,
  }
})

export const setSidebar = createAsyncThunk('appUsers/setSidebar', value => {
  return {
    value,
  }
})

export const setUser = createAsyncThunk('appUsers/setUser', user => {
  return {
    user,
  }
})

export const setError = createAsyncThunk('appUsers/setError', params => {
  return {
    error: params.error,
  }
})

export const getData = createAsyncThunk('appUsers/getData', async params => {
  const response = await apiCall(
    FIND,
    'users',
    {},
    {
      limit: params.perPage,
      queries: params.q,
      skip: (params.perPage * params.page - params.perPage) || 0,
    }
  )
  return {
    params,
    data: response.data.data,
    totalPages: response.data.total,
  }
})

export const getUser = createAsyncThunk('appUsers/getUser', async id => {
  const response = await axios.get('/api/users/user', { id })
  return response.data.user
})

export const updateUser = createAsyncThunk(
  'appUsers/updateUser',
  async (user, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const { id } = user
      delete user.id
      const response = await apiCall(UPDATE, 'users', user, { id })
      if (response.status === 200) {
        dispatch(setSidebar(false))
        await dispatch(getData(getState().users.params))

        return response.data
      }
      dispatch(setLoader(false))
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e
      dispatch(setError({ error: response.data || response || e }))
    }
    return user
  }
)

export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (user, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const response = await apiCall(CREATE, 'users', user)
      dispatch(setLoader(false))
      if (response.status === 201) {
        await dispatch(getData(getState().users.params))
        dispatch(setSidebar(false))
        return response.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e

      // Special case for 409 errors
      if (response.request.status === 409) {
        const errors = {}
        const res = JSON.parse(response.request.response)

        for (const key in res.errors) {
          errors[key] = res.message
        }

        dispatch(
          setError({
            error: { errors },
          })
        )
        return
      }

      dispatch(setError({ error: response.data || response || e }))
    }
    return user
  }
)

export const desactiveUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(UPDATE, 'users', { status: 0 }, { id })
    if (oResponse.status === 200) {
      await dispatch(getData(getState().users.params))
      toast.success('Usuario desactivada con exito')
    }
    return id
  }
)

export const activarUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(UPDATE, 'users', { status: 1 }, { id })
    if (oResponse.status === 200) {
      await dispatch(getData(getState().users.params))
      toast.success('Usuario activado con exito')
    }
    return id
  }
)

export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(DELETE, 'users', {}, { id })
    if (oResponse.status === 200) {
      await dispatch(getData(getState().users.params))
      toast.success('Usuario eliminado con exito')
    }
    return id
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 0,
    params: {},
    allData: [],
    selectedUser: null,
    error: null,
    sidebar: false,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload.user
      })
      .addCase(setSidebar.fulfilled, (state, action) => {
        state.sidebar = action.payload.value
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value
      })
  },
})

export default appUsersSlice.reducer
