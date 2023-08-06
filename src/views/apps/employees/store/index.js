// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  apiCall,
  CREATE,
  FIND,
  UPDATE,
  GET,
  DELETE,
  FILE_SAVE,
  DELETE_FILE,
  PRINTE,
} from '../../../../service/api'
import { toast } from 'react-hot-toast'

export const setLoader = createAsyncThunk('appEmployees/setLoader', value => {
  return {
    value,
  }
})

export const setSidebar = createAsyncThunk('appEmployees/setSidebar', value => {
  return {
    value,
  }
})

export const setModal = createAsyncThunk('appEmployees/setModal', value => {
  return {
    value,
  }
})

export const setPrintCredential = createAsyncThunk(
  'appEmployees/printCedential',
  async data => {
    toast.success('Enviando Impresion')
    try {
      const response = await apiCall(PRINTE, `credential-print/${data._id}`, {})
      if (response.status === 200) {
        toast.success('Impresion en proceso')
      }
      return response
    } catch (error) {
      console.log(error)
      toast.error('Falla al Imprimir')
    }
  }
)

export const setEmployee = createAsyncThunk(
  'appEmployees/setEmployee',
  user => {
    if (!user) return { user: null }
    return {
      user,
    }
  }
)

export const setErrorApi = createAsyncThunk(
  'appEmployees/setErrorApi',
  params => {
    if (!params) return { error: null }
    return {
      error: params.error,
    }
  }
)

export const setEmpleado = createAsyncThunk(
  'beneficiary/setBeneficiary',
  empleado => {
    if (!empleado) return { empleado: null }
    return {
      empleado,
    }
  }
)

export const setError = createAsyncThunk('appEmployees/setError', params => {
  return {
    error: params.error,
  }
})

export const getData = createAsyncThunk(
  'appEmployees/getData',
  async params => {
    const response = await apiCall(
      FIND,
      'employees',
      {},
      {
        limit: params.perPage,
        queries: params.q,
        skip: params.perPage * params.page - params.perPage,
        sort: params.sort,
      }
    )
    return {
      params,
      data: response.data.data,
      totalPages: response.data.total,
    }
  }
)

export const getEmployee = createAsyncThunk(
  'appEmployees/getEmployee',
  async id => {
    const response = await apiCall(GET, 'employees', {}, { id })
    return {
      data: response.data,
    }
  }
)

export const addEmployee = createAsyncThunk(
  'appEmployees/addEmployee',

  async (employee, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const response = await apiCall(CREATE, 'employees', employee)
      dispatch(setLoader(false))
      if (response.status === 201) {
        toast.success('Afiliado creado con exito')
        await dispatch(getData(getState().employees.params))
        toast.success('Cargue los Archivos')
        dispatch(setModal(true))
        dispatch(setEmployee(response.data))
        console.log(response.data)
        return response.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e
      if (response.request.status === 409) {
        dispatch(
          setError({
            error: { errors: { username: 'Nombre de usuario ya en uso' } },
          })
        )
        return
      }

      dispatch(setError({ error: response.data || response || e }))
    }
    return employee
  }
)

export const deleteEmployee = createAsyncThunk(
  'appEmployees/deleteEmployee',
  async (id, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(
        DELETE,
        'employees',
        { status: 2 },
        { id }
      )
      if (oResponse.status === 200) {
        toast.success('Afiliado eliminado con exito')
        await dispatch(getData(getState().employees.params))
      }
      return id
    } catch (err) {
      console.log(`error al  eliminar empleado:${err}`)
      toast.error('falla al eliminar afiliado')
    }
  }
)

export const updateEmployees = createAsyncThunk(
  'appEmployees/updateEmployee',
  async (params, { dispatch, getState }) => {
    try {
      const oResponse = await apiCall(UPDATE, 'employees', params, {
        id: params._id,
      })

      if (oResponse.status === 200) {
        toast.success('Afiliado modificado con exito')

        await dispatch(getData(getState().employees.params))

        dispatch(setSidebar(false))

        return oResponse.data
      }
    } catch (e) {
      const { response } = e

      dispatch(setError({ error: response.data || response || e }))
    }
    return payload
  }
)

export const setFile = createAsyncThunk(
  'appEmployees/setFile',
  async (file, { dispatch }) => {
    try {
      const { files, nameFile, id } = file

      const form_data = new FormData()
      form_data.append('file', files, nameFile)

      const response = await apiCall(FILE_SAVE, 's-3-handler', form_data)
      if (response.status === 201) {
        const multimedia_id = response.data[0].id
        const archivo_sel = {}

        let field_name = nameFile
        if (field_name === 'file') {
          field_name = 'selfie_id'
        }
        if (field_name === 'ine front') {
          field_name = 'ine_front_id'
        }
        if (field_name === 'ine back') {
          field_name = 'ine_back_id'
        }
        if (field_name === 'address') {
          field_name = 'proof_of_address_id'
        }
        archivo_sel[field_name] = multimedia_id

        try {
          await apiCall(UPDATE, `employees`, archivo_sel, { id })
          toast.success(`Archivo ${nameFile} caragado exitosamente`)
          dispatch(getEmployee(id))
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error) {
      console.log(`error al cargar archivo:${error}`)
      toast.error('falla al cargar archivo')
    }
  }
)

export const deleteFile = createAsyncThunk(
  'appEmployees/deleteFile',
  async (data, { dispatch }) => {
    try {
      const { id, name } = data
      let typeFile
      console.log('/*/*/*/*/*/*/*', data)
      const archivo_sel = {}
      let field_name = name
      if (field_name === 'file' || field_name === 'selfie_id') {
        field_name = 'selfie_id'
        typeFile = 'selfie'
      }
      if (field_name === 'ine front' || field_name === 'ine_front_id') {
        field_name = 'ine_front_id'
        typeFile = 'ine_f'
      }
      if (field_name === 'ine back' || field_name === 'ine_back_id') {
        field_name = 'ine_back_id'
        typeFile = 'ine_b'
      }
      if (field_name === 'address' || field_name === 'proof_of_address_id') {
        field_name = 'proof_of_address_id'
        typeFile = 'address'
      }
      archivo_sel[field_name] = ''
      console.log(archivo_sel)
      const response = await apiCall(UPDATE, `employees`, archivo_sel, { id })
      if (response.status === 200) {
        dispatch(getEmployee(id))
        toast.success(`archivo ${name} eliminado`)
        return {
          files: {
            name,
            type: typeFile,
            multimedia_id: null,
            file_path: null,
          },
        }
      }
    } catch (error) {
      console.log('error', error)
      toast.error('falla al eliminar archivo')
    }
  }
)

export const setFileEmployee = createAsyncThunk(
  'appEmployees/setFileEmployee',
  async (data, { dispatch }) => {
    try {
      const { id, files } = data
      await apiCall(UPDATE, 'employees', { files }, { id })
      const response = await apiCall(GET, 'employees', {}, { id })
      dispatch(setEmployee(response.data))
    } catch (error) {
      console.log(`error al aliminar archivo:${error}`)
      toast.error('falla al eliminar archivo')
    }
  }
)

export const updateFile = createAsyncThunk(
  'appEmployees/updateFile',
  async data => {
    return {
      data,
    }
  }
)

export const resetStateFiles = createAsyncThunk(
  'appEmployees/resetStateFiles',
  async () => {
    return {
      data: [
        {
          name: 'selfie',
          type: 'selfie',
          multimedia_id: null,
          file_path: null,
        },
        {
          name: 'ine front',
          type: 'ine_f',
          multimedia_id: null,
          file_path: null,
        },
        {
          name: 'ine back',
          type: 'ine_b',
          multimedia_id: null,
          file_path: null,
        },
        {
          name: 'address',
          type: 'address',
          multimedia_id: null,
          file_path: null,
        },
      ],
    }
  }
)

export const appEmployeesSlice = createSlice({
  name: 'appEmployees',
  initialState: {
    data: [],
    total: 0,
    params: {},
    allData: [],
    files: [
      {
        name: 'selfie',
        type: 'selfie',
        multimedia_id: null,
        file_path: null,
      },
      {
        name: 'ine front',
        type: 'ine_f',
        multimedia_id: null,
        file_path: null,
      },
      {
        name: 'ine back',
        type: 'ine_b',
        multimedia_id: null,
        file_path: null,
      },
      {
        name: 'address',
        type: 'address',
        multimedia_id: null,
        file_path: null,
      },
    ],
    selectedUser: false,
    empleado: false,
    error: null,
    sidebar: false,
    loading: false,
    modal: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data
        state.params = action.payload.params
        state.total = action.payload.totalPages
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.selectedUser = action.payload.data
        state.empleado = action.payload.data
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error
      })
      .addCase(setEmployee.fulfilled, (state, action) => {
        state.selectedUser = action.payload.user
      })
      .addCase(setSidebar.fulfilled, (state, action) => {
        state.sidebar = action.payload.value
      })
      .addCase(setEmpleado.fulfilled, (state, action) => {
        state.empleado = action.payload.empleado
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value
      })
      .addCase(setModal.fulfilled, (state, action) => {
        state.modal = action.payload.value
      })
      .addCase(setFile.fulfilled, (state, action) => {
        switch (action.payload.files.type) {
          case 'selfie':
            state.files[0] = action.payload.files
            break
          case 'ine_f':
            state.files[1] = action.payload.files
            break
          case 'ine_b':
            state.files[2] = action.payload.files
            break
          case 'address':
            state.files[3] = action.payload.files
            break
          default:
            return null
        }
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        if (action.payload) {
          switch (action.payload.files.type) {
            case 'selfie':
              state.files[0] = action.payload.files
              break
            case 'ine_f':
              state.files[1] = action.payload.files
              break
            case 'ine_b':
              state.files[2] = action.payload.files
              break
            case 'address':
              state.files[3] = action.payload.files
              break
            default:
              return null
          }
        }
      })
      .addCase(updateFile.fulfilled, (state, action) => {
        state.files = action.payload.data
      })
      .addCase(resetStateFiles.fulfilled, (state, action) => {
        state.files = action.payload.data
      })
  },
})

export default appEmployeesSlice.reducer
