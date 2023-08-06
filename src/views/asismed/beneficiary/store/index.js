/*eslint semi: ["error", "always"]*/
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiCall, FIND, CREATE, UPDATE } from '../../../../service/api';
import { toast } from 'react-hot-toast';

export const getData  = createAsyncThunk('beneficiary/getData', async params => {
  const response = await apiCall(
    FIND,
    'beneficiary-registration',
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
      total:response.data.total
    };
  });

  export const FindBeneficiary  = createAsyncThunk('beneficiary/finBeneficiary', async params => {
    const response = await apiCall(
      FIND,
     'beneficiary-registration',
      {},
      {
      limit: params.perPage,
      queries: `nombre=${params.q}`,
      skip: (params.perPage * params.page) - params.perPage 
      }
    );
      return {
        params,
        data: response.data.data,
        total:response.data.total
      };
    });

  export const setLoader = createAsyncThunk('beneficiary/setLoader', value => {
    return {
      value
    };
  });
  
  export const setError = createAsyncThunk('beneficiary/setError', params => {
    return {
      error: params.error
    };
  });

  export const setModal = createAsyncThunk('beneficiary/setModal', value => {
    return {
      value
    };
  });
  
  export const setBeneficiary = createAsyncThunk('beneficiary/setBeneficiary', beneficiary => {
        if (!beneficiary) return { beneficiary:null};
      return {
        beneficiary
      };
    });

 export const addBeneficiary = createAsyncThunk('beneficiary/addBeneficiary',
      async (beneficiary, { dispatch, getState }) => {
        try {
          dispatch(setLoader(true));

          const response = await apiCall(CREATE, 'beneficiary-registration', beneficiary);
          
          dispatch(setLoader(false));
          
          if (response.status === 201) {
            toast.success('Beneficiario creado con exito');
            await dispatch(getData(getState().beneficiary.params));
          
            dispatch(setSidebar(false));
          
            return response.data;
          }
        } catch (e) {
          dispatch(setLoader(false));
          const { response } = e;    
          dispatch(setError({ error: response.data || response || e }));
        }
        return beneficiary;
      }
    );

       
  export const appBeneficiarySlice = createSlice({
    name: 'beneficiary',
    initialState: {
      data: [],
      params: {},
      selectedBeneficiary:null,
      total:0,
      error: null,
      modal:false,
      loading: false
    },
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getData.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.params = action.payload.params;
      })
      .addCase(FindBeneficiary.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.total = action.payload.total;
        state.params = action.payload.params;
      })
      .addCase(setError.fulfilled, (state, action) => {
        state.error = action.payload.error;
      })
      .addCase(setModal.fulfilled, (state, action) => {
        state.modal = action.payload.value;
      })
      .addCase(setLoader.fulfilled, (state, action) => {
        state.loading = action.payload.value;
      })
      .addCase(setBeneficiary.fulfilled, (state, action) => {
        state.selectedBeneficiary = action.payload.beneficiary;
      });
    }
  });

  export default appBeneficiarySlice.reducer;

