// src/store/slices/refundTransactionListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { TRANSACTION_URL } from "../../../../constants/apiUrls";

/*
export const getRefundTransactionList = createAsyncThunk(
  "TransactionProvision/GetTransactionProvisionSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionProvisionSearch, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);
*/

const testData = [
  {
    guid: 250203071926005540,
    field1: 302011,
    field2: 'İptal',
    field3: '2.400 TL',
    field4: 'Erdal Kurt',
    field5: '13-03-2025 17:10',
    field6: 'Devam Ediyor',
  },
  {
    guid: 250200554130719260,
    field1: 302012,
    field2: 'İade',
    field3: '500 TL',
    field4: 'Eray Şentürk',
    field5: '03-02-2025 10:19',
    field6: 'Tamamlandı',
  }
];

// backend servisi geldiğinde yukarıdaki kullanılacak uygun apiye istek atılıp response return edilecek
export const getRefundTransactionList = createAsyncThunk(
  "TransactionProvision/GetRefundTransactionList",
  async (userData, { rejectWithValue }) => {
    try {
      const response = testData;
      return response;
    } catch (error) {
    }
  }
);

const refundTransactionListSlice = createSlice({
  name: "refundTransactionList",
  initialState: {
    loading: false,
    error: null,
    success: false,
    refundTransactionList: [],
    deleteSuccess: false,
  },
  reducers: {
    clearRefundTransactionListState: (state) => {
      state.loading = false;
      state.deleteSuccess = false,
      state.error = null;
      state.success = false;
      state.refundTransactionList = null;
    },
    setRefundTransactionListError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getRefundTransactionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRefundTransactionList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.refundTransactionList = action.payload;
        state.error = null;
      })
      .addCase(getRefundTransactionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRefundTransactionListState, setRefundTransactionListError } = refundTransactionListSlice.actions;
export default refundTransactionListSlice.reducer;
