import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiCall, CREATE, FIND, UPDATE, DELETE } from '../../../../service/api'
import { toast } from 'react-hot-toast'

export const setLoader = createAsyncThunk('appCompanies/setLoader', value => {
  return {
    value
  }
})

export const setSidebar = createAsyncThunk('appCompanies/setSidebar', value => {
  return {
    value
  }
})

export const setCompany = createAsyncThunk('appCompanies/setCompany', company => {
  if (!company) return { company: null }
  return {
    company
  }
})

export const setError = createAsyncThunk('appCompanies/setError', params => {
  return {
    error: params.error
  }
})

export const getData = createAsyncThunk('appCompanies/getData', async params => {
  const response = await apiCall(
    FIND,
    'companies',
    {},
    {
      limit: params.perPage,
      queries: params.q,
      skip: params.perPage * params.page - params.perPage
    }
  )
  return {
    params,
    data: response.data.data,
    total: response.data.total,
    totalPages: response.data.total
  }
})

export const getCompany = createAsyncThunk('appCompanies/getCompany', async id => {
  const response = await axios.get('/api/users/user', { id })
  return response.data.user
})

export const addCompany = createAsyncThunk(
  'appCompanies/addCompany',
  async (company, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const response = await apiCall(CREATE, 'companies', company)
      dispatch(setLoader(false))
      if (response.status === 201) {
        toast.success('Empresa creado con exito')
        await dispatch(getData(getState().companies.params))
        dispatch(setSidebar(false))
        return response.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e

      // Special case for 409 errors
      if (response.request.status === 409) {
        dispatch(
          setError({
            error: { errors: { username: "Nombre de usuario ya en uso" } }
          })
        )
        return
      }

      dispatch(setError({ error: response.data || response || e }))
    }
    return user
  }
)

export const updateCompany = createAsyncThunk(
  'appCompanies/updateCompany',
  async ({ id, company }, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const oResponse = await apiCall(UPDATE, 'companies', company, { id })
      dispatch(setLoader(false))
      if (oResponse.status === 200) {
        toast.success('Empresa modificada con exito')
        await dispatch(getData(getState().companies.params))
        dispatch(setSidebar(false))
        return oResponse.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e

      dispatch(setError({ error: response.data || response || e }))
    }
    return company
  }
)

export const desactiveCompany = createAsyncThunk(
  'appCompanies/desactiveCompany',
  async (id, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(UPDATE, 'companies', { status: Number(2) }, { id })
      if (oResponse.status === 200) {
        toast.success('Empresa desactivada con exito')
        await dispatch(getData(getState().companies.params))
      }
      return id
    } catch (err) {
      toast.error('No se pudo cambiar el estado de la compañia ')
    }


  }
)
export const activeCompany = createAsyncThunk(
  'appCompanies/activeCompany',
  async (id, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(UPDATE, 'companies', { status: Number(1) }, { id })
      if (oResponse.status === 200) {
        toast.success('Empresa activada con exito')
        await dispatch(getData(getState().companies.params))
      }
      return id
    } catch (err) {
      toast.error('No se pudo cambiar el estado de la compañia ')
    }

  }
)

export const deleteCompany = createAsyncThunk(
  'appCompanies/deleteCompany',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(UPDATE, 'companies', { status: Number(0) }, { id })
    if (oResponse.status === 200) {
      toast.success('Empresa eliminada con exito')
      await dispatch(getData(getState().companies.params))
    }
    return id
  }
)

export const appCompaniesSlice = createSlice({
  name: 'appCompanies',
  initialState: {
    data: [],
    total: 0,
    params: {},
    allData: [],
    selectedCompany: null,
    error: null,
    sidebar: false,
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(setCompany.fulfilled, (state, action) => {
        state.selectedCompany = action.payload.company
      })
      .addCase(setSidebar.fulfilled, (state, action) => {
        state.sidebar = action.payload.value
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value
      })
  }
})

export default appCompaniesSlice.reducer