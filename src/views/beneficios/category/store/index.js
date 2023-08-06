import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiCall, FIND, CREATE, UPDATE } from '../../../../service/api'
import { toast } from 'react-hot-toast'

export const getData = createAsyncThunk(
  'benefitCategory/getData',
  async params => {
    const response = await apiCall(
      FIND,
      'benefit-category',
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
  }
)

export const FindBenefitCategory = createAsyncThunk(
  'benefitCategory/finbenefitCategory',
  async params => {
    const response = await apiCall(
      FIND,
      'benefit-category',
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

export const setLoader = createAsyncThunk(
  'benefitCategory/setLoader',
  value => {
    return {
      value,
    }
  }
)

export const setError = createAsyncThunk('benefitCategory/setError', params => {
  return {
    error: params.error,
  }
})

export const setModal = createAsyncThunk('benefitCategory/setModal', value => {
  return {
    value,
  }
})

export const setbenefitCategory = createAsyncThunk(
  'benefitCategory/setbenefitCategory',
  category => {
    if (!category) return { category: null }
    return {
      category,
    }
  }
)

export const addbenefitCategory = createAsyncThunk(
  'benefitCategory/addbenefitCategory',
  async (category, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const response = await apiCall(CREATE, 'benefit-category', category)
      if (response === 200) {
        toast.success('Categoria creada exitosamente')
        dispatch(setLoader(false))
        await dispatch(getData(getState().benefitCategory.params))
        dispatch(setModal(false))
        return response.data
      }

    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e
      dispatch(setError({ error: response.data || response || e }))
    }
    return category
  }
)

export const updateCategory = createAsyncThunk(
  'benefitCategory/updateCategory',
  async (category, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const { id } = category
      delete category.id
      delete category._id
      const response = await apiCall(UPDATE, `benefit-category`, category, {
        id
      })
      dispatch(setLoader(false))
      if (response.status === 200) {
        dispatch(setModal(false))
        await dispatch(getData(getState().benefitCategory.params))
        toast.success('modificado exitosamente')
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

export const desactiveCategory = createAsyncThunk(
  'benefitCategory/inactive',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(
      UPDATE,
      'benefit-category',
      { status: 0 },
      { id }
    )
    if (oResponse.status === 200) {
      await dispatch(getData(getState().benefitCategory.params))
      toast.success('desactivado exitosamente')
    }
    return id
  }
)

export const activeCategory = createAsyncThunk(
  'benefitCategory/active',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(
      UPDATE,
      'benefit-category',
      { status: 1 },
      { id }
    )
    if (oResponse.status === 200) {
      await dispatch(getData(getState().benefitCategory.params))
      toast.success('activado exitosamente')
    }
    return id
  }
)

export const appbenefitSlice = createSlice({
  name: 'benefitCategory',
  initialState: {
    data: [],
    params: {},
    selectedCategory: null,
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
      .addCase(FindBenefitCategory.fulfilled, (state, action) => {
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
      .addCase(setbenefitCategory.fulfilled, (state, action) => {
        state.selectedCategory = action.payload.category
      })
  },
})

export default appbenefitSlice.reducer
