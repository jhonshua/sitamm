import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiCall, FIND, CREATE, UPDATE } from '../../../../service/api'
import { toast } from 'react-hot-toast'

export const getData = createAsyncThunk('benefit/getData', async params => {
  const response = await apiCall(
    FIND,
    'benefit',
    {},
    {
      limit: params.perPage,
      queries: params.q,
      skip: params.perPage * params.page - params.perPage,
    }
  )
  return {
    params,
    data: response.data.data,
    total: response.data.total,
  }
})

export const FindBenefit = createAsyncThunk(
  'benefit/finbenefit',
  async params => {
    const response = await apiCall(
      FIND,
      'benefit',
      {},
      {
        limit: params.perPage,
        queries: `nombre=${params.q}`,
        skip: params.perPage * params.page - params.perPage,
      }
    )
    return {
      params,
      data: response.data.data,
      total: response.data.total,
    }
  }
)

export const setLoader = createAsyncThunk('benefit/setLoader', value => {
  return {
    value,
  }
})

export const setError = createAsyncThunk('benefit/setError', params => {
  return {
    error: params.error,
  }
})

export const setModal = createAsyncThunk('benefit/setModal', value => {
  return {
    value,
  }
})

export const setbenefit = createAsyncThunk('benefit/setbenefit', benefit => {
  if (!benefit) return { benefit: null }
  return {
    benefit,
  }
})

export const addbenefit = createAsyncThunk(
  'benefit/addbenefit',
  async (benefit, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))

      const response = await apiCall(CREATE, 'benefit', benefit)

      dispatch(setLoader(false))

      await dispatch(getData(getState().benefit.params))

      dispatch(setSidebar(false))

      return response.data
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e
      dispatch(setError({ error: response.data || response || e }))
    }
    return benefit
  }
)

export const updateBenefit = createAsyncThunk(
  'benefit/updateBenefit',
  async (benefit, { dispatch, getState }) => {
    debugger
    try {
      dispatch(setLoader(true))
      const { id } = benefit
      delete benefit.id
      delete benefit._id
      const response = await apiCall(UPDATE, 'benefit', benefit, {
        id,
      })
      dispatch(setLoader(false))
      if (response.status === 200) {
        dispatch(setModal(false))
        await dispatch(getData(getState().benefit.params))
        return response.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e
      dispatch(setError({ error: response.data || response || e }))
      throw e
    }
  }
)

export const desactiveBenefit = createAsyncThunk(
  'benefit/inactive',
  async (id, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(UPDATE, 'benefit', { status: 0 }, { id })
      if (oResponse.status === 200) {
        await dispatch(getData(getState().benefit.params))
        toast.success('Beneficio desactivado exitosamente')
      }
      return id
    } catch (error) {
      console.log(error)
      toast.error('No se puede desactivar beneficio')
    }

  }
)

export const activeBenefit = createAsyncThunk(
  'benefit/active',
  async (id, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(UPDATE, 'benefit', { status: 1 }, { id })
      if (oResponse.status === 200) {
        await dispatch(getData(getState().benefit.params))
        toast.success('Beneficio activado exitosamente')
      }
      return id
    } catch (error) {
      console.log(error)
      toast.error('No se puede activar beneficio')
    }

  }
)

export const appbenefitSlice = createSlice({
  name: 'benefit',
  initialState: {
    data: [],
    params: {},
    selectedBenefit: null,
    total: 0,
    error: null,
    modal: false,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.total = action.payload.total
        state.params = action.payload.params
      })
      .addCase(FindBenefit.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.total = action.payload.total
        state.params = action.payload.params
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(setModal.fulfilled, (state, action) => {
        state.modal = action.payload.value
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value
      })
      .addCase(setbenefit.fulfilled, (state, action) => {
        state.selectedBenefit = action.payload.benefit
      })
  },
})

export default appbenefitSlice.reducer
