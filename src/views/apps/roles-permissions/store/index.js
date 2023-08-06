// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall, FIND } from '../../../../service/api'; 

// ** Axios Imports
import axios from 'axios'

export const getData = createAsyncThunk('permissions/getData', async params => {
  const response = await apiCall(
    FIND,
    'roles',
    {},
    {
      limit: params.perPage,
      skip: (params.perPage * params.page - params.perPage),
      queries: '$include=users',
    },
  );

  return {
    allData: response.data.data,
    data: response.data.data,
    params,
    total: response.data.total,
  }
});

export const addPermission = createAsyncThunk(
  'permissions/addPermission',
  async (permission, { dispatch, getState }) => {
    await axios.post('/apps/permissions/add-permission', { permission })
    await dispatch(getData(getState().permissions.params))
    return permission
  }
)

export const addRole = createAsyncThunk(
  'appRoles/addRole',
  async (role, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true));
      const response = await apiCall(CREATE, 'roles', role);
      dispatch(setLoader(false));
      if (response.status === 201) {
        await dispatch(getData(getState().permissions.params));
        return response.data;
      }
    } catch (e) {
      dispatch(setLoader(false));
      const { response } = e;

      // Special case for 409 errors
      if (response.request.status === 409) {
        const errors = {};
        const res = JSON.parse(response.request.response);

        for (const key in res.errors) {
          errors[key] = res.message;
        }

        dispatch(
          setError({
            error: { errors },
          })
        );
        return;
      }

      dispatch(setError({ error: response.data || response || e }));
    }
    return role;
  }
);

export const setRol = createAsyncThunk('appRoles/setRol', rol => {
  if (!rol) return { rol:null }
  return {
    rol,
  };
});

export const updateRol = createAsyncThunk(
  'appRoles/updateRole',
  async ({ id, role }, { dispatch, getState }) => {
    try {
      dispatch(setLoader(true))
      const oResponse = await apiCall(UPDATE, 'roles', role, { id })
      dispatch(setLoader(false))
      if (oResponse.status === 200) {
        await dispatch(getData(getState().permissions.params))
        return oResponse.data
      }
    } catch (e) {
      dispatch(setLoader(false))
      const { response } = e

      dispatch(setError({ error: response.data || response || e }))
    }
    return id
  }
);


export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ id, name }, { dispatch, getState }) => {
    await axios.post('/apps/permissions/update-permission', { id, name })
    await dispatch(getData(getState().permissions.params))
    return { id, name }
  }
)

export const deletePermission = createAsyncThunk('permissions/deletePermission', async (id, { dispatch, getState }) => {
  await axios.delete('/apps/permissions/delete', { id })
  await dispatch(getData(getState().permissions.params))
  return id
})

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selected: null
  },
  reducers: {
    selectPermission: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(getData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
    .addCase(setRol.fulfilled, (state, action) => {
      state.selected = action.payload.rol
    })
  }
})

export const { selectPermission } = permissionsSlice.actions

export default permissionsSlice.reducer
