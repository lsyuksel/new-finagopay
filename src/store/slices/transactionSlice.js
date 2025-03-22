import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import {
  TRANSACTION_URL,
  CARD_URL,
  BANK_URL,
  CURRENCY_URL,
  TRANSACTION_TYPE_URL,
  PAYMENT_URL
} from '../../constants/apiUrls';

export const getTransactionProvisions = createAsyncThunk(
  'transaction/getTransactionProvisions',
  async (params, { rejectWithValue }) => {
    try {
      const data = typeof params === 'string' ? JSON.parse(params) : params;
      const response = await api.post(TRANSACTION_URL.GetTransactionProvisionSearch, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getTransactionProvisionSettles = createAsyncThunk(
  'transaction/getTransactionProvisionSettles',
  async (params, { rejectWithValue }) => {
    try {
      const data = typeof params === 'string' ? JSON.parse(params) : params;
      const response = await api.post(TRANSACTION_URL.GetTransactionProvisionSettleSearch, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getCardBrands = createAsyncThunk(
  'transaction/getCardBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(CARD_URL.GetAllCardBrandDef);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getCardTypes = createAsyncThunk(
  'transaction/getCardTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(CARD_URL.GetAllCardType);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getBanks = createAsyncThunk(
  'transaction/getBanks',
  async (params, { rejectWithValue }) => {
    try {
      const data = typeof params === 'string' ? JSON.parse(params) : params;
      const response = await api.post(BANK_URL.GetUsersPayFacIntegrationEnabledBankList, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response || { message: 'Bir hata oluştu' });
    }
  }
);

export const getCurrencies = createAsyncThunk(
  'transaction/getCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(CURRENCY_URL.GetCurrencyDef);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getTransactionTypes = createAsyncThunk(
  'transaction/getTransactionTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(TRANSACTION_TYPE_URL.GetAllRavenTransactionTypeDef);
      console.log("GetAllRavenTransactionTypeDef",response)
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

export const getPaymentStatuses = createAsyncThunk(
  'transaction/getPaymentStatuses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(PAYMENT_URL.GetAllPayOutStatusDef);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Bir hata oluştu' });
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  transactionProvisions: [],
  transactionProvisionSettles: [],
  cardBrands: [],
  cardTypes: [],
  banks: [],
  currencies: [],
  transactionTypes: [],
  paymentStatuses: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Transaction Provisions
      .addCase(getTransactionProvisions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionProvisions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionProvisions = action.payload;
      })
      .addCase(getTransactionProvisions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'İşlemler getirilirken bir hata oluştu';
      })
      
      // Transaction Provision Settles
      .addCase(getTransactionProvisionSettles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionProvisionSettles.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionProvisionSettles = action.payload;
      })
      .addCase(getTransactionProvisionSettles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'İşlemler getirilirken bir hata oluştu';
      })
      
      // Card Brands
      .addCase(getCardBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCardBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.cardBrands = action.payload;
      })
      .addCase(getCardBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Kart markaları getirilirken bir hata oluştu';
      })
      
      // Card Types
      .addCase(getCardTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCardTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.cardTypes = action.payload;
      })
      .addCase(getCardTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Kart tipleri getirilirken bir hata oluştu';
      })
      
      // Banks
      .addCase(getBanks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
      })
      .addCase(getBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Bankalar getirilirken bir hata oluştu';
      })
      
      // Currencies
      .addCase(getCurrencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrencies.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(getCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Para birimleri getirilirken bir hata oluştu';
      })
      
      // Transaction Types
      .addCase(getTransactionTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionTypes = action.payload;
      })
      .addCase(getTransactionTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'İşlem tipleri getirilirken bir hata oluştu';
      })
      
      // Payment Statuses
      .addCase(getPaymentStatuses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaymentStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatuses = action.payload;
      })
      .addCase(getPaymentStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Ödeme durumları getirilirken bir hata oluştu';
      });
  },
});

export const { clearErrors } = transactionSlice.actions;
export default transactionSlice.reducer; 