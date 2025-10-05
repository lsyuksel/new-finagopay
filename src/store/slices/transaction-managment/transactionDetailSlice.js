// src/store/slices/transactionDetailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT, TRANSACTION_URL } from "../../../constants/apiUrls";

export const getTransactionDetail = createAsyncThunk(
  "UnifiedTransaction/GetTransactionDetail",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionDetail, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

const transactionDetailSlice = createSlice({
  name: "transactionDetail",
  initialState: {
    loading: false,
    error: null,
    success: false,
    transactionDetail: [],
  },
  reducers: {
    clearTransactionDetailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.transactionDetail = null;
    },
    setTransactionDetailError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Detail page State
      .addCase(getTransactionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.transactionDetail = [action.payload];
        state.error = null;
      })
      .addCase(getTransactionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearTransactionDetailState, setTransactionDetailError, saveDetailData } = transactionDetailSlice.actions;
export default transactionDetailSlice.reducer;
