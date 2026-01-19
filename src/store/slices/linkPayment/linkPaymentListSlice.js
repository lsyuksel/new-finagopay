// src/store/slices/linkPaymentListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../constants/apiUrls";

export const updateMerchantLinkPayment = createAsyncThunk(
  "/MerchantLinkPayment/UpdateMerchantLinkPayment",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put(MERCHANT_LINK_PAYMENT.UpdateMerchantLinkPayment, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

export const deletePaymentRecord = createAsyncThunk(
  "MerchantLinkPayment/UpdateMerchantLinkPaymentByStatus",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${MERCHANT_LINK_PAYMENT.UpdateMerchantLinkPaymentByStatus}?guid=${userData}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).errorCode || parseErrorResponse(error.response.data).message || t("messages.linkPaymentError")
      );
    }
  }
);

export const getLinkPaymentList = createAsyncThunk(
  "MerchantLinkPayment/GetAllMerchantLinkPaymentByUserName",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_LINK_PAYMENT.GetAllMerchantLinkPaymentByUserName, {
          userName: userData,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.linkPaymentError")
      );
    }
  }
);

const linkPaymentListSlice = createSlice({
  name: "linkPaymentList",
  initialState: {
    loading: false,
    error: null,
    success: false,
    paymentList: [],
    deleteSuccess: false,
  },
  reducers: {
    clearLinkPaymentListState: (state) => {
      state.loading = false;
      state.deleteSuccess = false,
      state.error = null;
      state.success = false;
      state.paymentList = null;
    },
    setLinkPaymentListError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMerchantLinkPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMerchantLinkPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updateMerchantLinkPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deletePaymentRecord.pending, (state) => {
        state.loading = true;
        state.deleteSuccess = false,
        state.error = null;
      })
      .addCase(deletePaymentRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true,
        state.success = true;
        state.error = null;
      })
      .addCase(deletePaymentRecord.rejected, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true,
        state.error = action.payload;
      })
      
      .addCase(getLinkPaymentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLinkPaymentList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.paymentList = action.payload;
        state.error = null;
      })
      .addCase(getLinkPaymentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLinkPaymentListState, setLinkPaymentListError } = linkPaymentListSlice.actions;
export default linkPaymentListSlice.reducer;
