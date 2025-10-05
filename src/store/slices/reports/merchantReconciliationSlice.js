// src/store/slices/merchantReconciliationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { REPORTS_URL } from "../../../constants/apiUrls";

export const getMerchantReconciliationList = createAsyncThunk(
  "MerchantPaymentFile/GetMerchantPaymentFileSearchByUserName",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(REPORTS_URL.GetMerchantPaymentFileSearchByUserName, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);


const merchantReconciliationListSlice = createSlice({
  name: "merchantReconciliationList",
  initialState: {
    loading: false,
    error: null,
    success: false,
    merchantReconciliationList: [],
    deleteSuccess: false,
  },
  reducers: {
    clearMerchantReconciliationListState: (state) => {
      state.loading = false;
      state.deleteSuccess = false,
      state.error = null;
      state.success = false;
      state.merchantReconciliationList = null;
    },
    setMerchantReconciliationListError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getMerchantReconciliationList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantReconciliationList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchantReconciliationList = action.payload;
        state.error = null;
      })
      .addCase(getMerchantReconciliationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });      
  },
});

export const { clearMerchantReconciliationListState, setMerchantReconciliationListError } = merchantReconciliationListSlice.actions;
export default merchantReconciliationListSlice.reducer;
