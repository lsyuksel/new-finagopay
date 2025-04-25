import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { SELECT_OPTIONS_URL } from '../../constants/apiUrls';

export const getCurrencyDef = createAsyncThunk(
  'Currency/GetCurrencyDef',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.selectOptions.currencyDef.length === 0) {
      try {
        const response = await api.get(SELECT_OPTIONS_URL.GetCurrencyDef);
        return response || [];
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
      }
    }
  }
);

export const getAllProductType = createAsyncThunk(
  'ProductType/GetAllProductType',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get(SELECT_OPTIONS_URL.GetAllProductType);
      return response || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
    }
  }
);
const initialState = {
  currencyDef: [],
  allProductType: [],
  loading: false,
  error: null,
  initialized: false,
};

const selectOptionsSlice = createSlice({
  name: 'selectOptions',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrencyDef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCurrencyDef.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyDef = action.payload;
        state.initialized = true;
        state.error = null;
      })
      .addCase(getAllProductType.fulfilled, (state, action) => {
        state.loading = false;
        state.allProductType = action.payload;
        state.initialized = true;
        state.error = null;
      })

      .addCase(getCurrencyDef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      });
  },
});

export const { } = selectOptionsSlice.actions;

export default selectOptionsSlice.reducer; 