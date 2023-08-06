/*eslint semi: ["error", "always"]*/
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiCall, FIND } from '../../../../service/api';

export const getPayment = createAsyncThunk('payment/getData', async params => {
  const response = await apiCall(
    FIND,
    'payments',
    {},
    {
      limit: params.perPage,
      queries: params.q,
      skip: (params.perPage * params.page) - params.perPage 
    }
  );
    return {
      params,
      data: response.data.data,
      total:response.data.total,
      allData: response.data.data 
    };
  });

  export const setLoader = createAsyncThunk('payment/setLoader', value => {
    return {
      value
    };
  });
  
  export const setError = createAsyncThunk('payment/setError', params => {
    return {
      error: params.error
    };
  });

  export const setSidebar = createAsyncThunk('payment/setSidebar', value => {
    return {
      value
    };
  });

 
  export const setPayment = createAsyncThunk('payment/selected', ({_id, employee_id, created_at, amount, employees }) => {

    const payment = {
       _id,
       employee_id,
       name: employees ? employees.name : "",
       last_name: employees ? employees.last_name : "",
       created_at,
       amount
    };
    return {
      payment 
    };
  });

  export const updatePayment = createAsyncThunk(
    'payment/update',
    async ({ id, payload }, { dispatch, getState }) => {
      try {
        dispatch(setLoader(true));
        const oResponse = await apiCall(UPDATE, 'payments', payload, { id });
      
        dispatch(setLoader(false));
      
        if (oResponse.status === 200) {
      
          await dispatch(getPayment(getState().payment.params));
      
          dispatch(setSidebar(false));
      
          return oResponse.data;
        }
      } catch (e) {
        dispatch(setLoader(false));
        const { response } = e;
  
        dispatch(setError({ error: response.data || response || e }));
      }
      return company;
    }
  );

  export const appPaymentSlice = createSlice({
    name: 'payment',
    initialState: {
      data: [],
      params: {},
      selectedPayment:null,
      total:0,
      error: null,
      sidebar:false,
      loading: false,
      allData: []
    },
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getPayment.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.params = action.payload.params;
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error;
      })
      .addCase(setSidebar.fulfilled, (state, action) => {
        state.sidebar = action.payload.value;
      })
      .addCase(setPayment.fulfilled, (state, action) => {
        state.selectedPayment = action.payload.payment;
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value;
      });
    }
  });

  export default appPaymentSlice.reducer;