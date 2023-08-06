import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiCall, CREATE, FIND, UPDATE, GET } from '../../../../service/api'

export const setLoader = createAsyncThunk('appLoans/setLoader', value => {
  return {
    value,
  }
})

export const setSidebar = createAsyncThunk('appLoans/setSidebar', value => {
  return {
    value,
  }
})

export const setModal = createAsyncThunk('appLoans/setModal', value => {
  return {
    value,
  }
})

export const setModal_contartos = createAsyncThunk(
  'appLoans/setModal_contartos',
  value => {
    return {
      value,
    }
  }
)

export const getData_multimedia_contratos = createAsyncThunk(
  'appLoans/getData_multimedia_contratos',
  async id => {
    const response = await apiCall(GET, 'pdf-proxy', {}, { id })
    return response.data
  }
)

export const getData_multimedia_Nom = createAsyncThunk(
  'appLoans/getData_multimedia_Nom',
  async id => {
    const response = await apiCall(GET, 'pdf-proxy', {}, { id })
    try {
      console.log(response.data)
      return response.data
    } catch (e) {
      console.log(e)
    }
    return response.data
  }
)

export const setModal_Nom = createAsyncThunk('appLoans/setModal_Nom', value => {
  return {
    value,
  }
})

export const setLoan = createAsyncThunk('appLoans/setLoan', loan => {
  return {
    loan,
  }
})

export const setError = createAsyncThunk('appLoans/setError', params => {
  return {
    error: params.error,
  }
})

export const getData = createAsyncThunk('appLoans/getData', async params => {
  const response = await apiCall(
    FIND,
    'loans',
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
    totalPages: response.data.total,
  }
})

export const getLoan = createAsyncThunk('appLoans/getLoan', async id => {
  const response = await axios.get('/api/users/user', { id })
  return response.data.user
})

export const addLoan = createAsyncThunk(
  'appLoans/addLoan',
  async (loan, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const response = await apiCall(CREATE, 'loans', loan)
      dispatch(setLoader(false))
      if (response.status === 201) {
        await dispatch(getData(getState().loans.params))
        dispatch(setSidebar(false))
        return response.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e

      dispatch(setError({ error: response.data || response || e }))
    }
    return user
  }
)

export const updateLoan = createAsyncThunk(
  'appLoans/updateLoan',
  async ({ id, loan }, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const oResponse = await apiCall(UPDATE, 'loans', loan, { id })
      dispatch(setLoader(false))
      if (oResponse.status === 200) {
        await dispatch(getData(getState().loans.params))
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

export const deleteLoan = createAsyncThunk(
  'appLoans/deleteLoan',
  async (id, { dispatch, getState }) => {
    const oResponse = await apiCall(UPDATE, 'loans', { status: 1 }, { id })
    if (oResponse.status === 200) {
      await dispatch(getData(getState().loans.params))
    }
    return id
  }
)

export const appLoansSlice = createSlice({
  name: 'appLoans',
  initialState: {
    data: [],
    total: 0,
    params: {},
    allData: [],
    selectedLoan: null,
    error: null,
    sidebar: false,
    loading: false,
    modal: false,
    modal_contratos: false,
    modal_Nom: false,
    multimedia_contratos: false,
    multimedia_Nom: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getLoan.fulfilled, (state, action) => {
        state.selectedLoan = action.payload
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(setLoan.fulfilled, (state, action) => {
        state.selectedLoan = action.payload.loan
      })
      .addCase(setSidebar.fulfilled, (state, action) => {
        state.sidebar = action.payload.value
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value
      })
      .addCase(setModal.fulfilled, (state, action) => {
        state.modal = action.payload.value
      })
      .addCase(setModal_contartos.fulfilled, (state, action) => {
        state.modal_contratos = action.payload.value
      })
      .addCase(setModal_Nom.fulfilled, (state, action) => {
        state.modal_Nom = action.payload.value
      })
      .addCase(getData_multimedia_contratos.fulfilled, (state, action) => {
        state.multimedia_contratos = action.payload
      })
      .addCase(getData_multimedia_Nom.fulfilled, (state, action) => {
        state.multimedia_Nom = action.payload
      })
  },
})

export default appLoansSlice.reducer
