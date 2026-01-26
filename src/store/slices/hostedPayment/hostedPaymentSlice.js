// src/store/slices/hostedPaymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../constants/apiUrls";
import { managementApi } from "../../../services/api";

export const hostedPageDoPayment = createAsyncThunk(
  "/HostedPayment/HostedPageDoPayment",
  async (userData, { rejectWithValue }) => {
      try {
        const response = await managementApi.post(MERCHANT_LINK_PAYMENT.HostedPageDoPayment, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response?.data).message || t("messages.error")
      );
    }
  }
);

export const getInstallments = createAsyncThunk(
  "/MerchantLinkPayment/ProcessCheckBin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await managementApi.post(MERCHANT_LINK_PAYMENT.GetInstallments, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

export const getHostedPayment = createAsyncThunk(
    "HostedPaymentPage/GetHostedPage",
    async (userData, { rejectWithValue }) => {
      try {
        const response = await managementApi.post(MERCHANT_LINK_PAYMENT.GetHostedPage, userData);
        return response;
      } catch (error) {
        return rejectWithValue(
          parseErrorResponse(error.response.data).message || t("messages.linkPaymentError")
        );
      }
    }
);

const hostedPaymentSlice = createSlice({
  name: "hostedPayment",
  initialState: {
    loading: false,
    error: null,
    success: false,
    hostedPayment: null,
    installmentList: null,
    hostedPaymentResult: null,
  },
  reducers: {
    clearHostedPaymentResult: (state) => {
      state.hostedPaymentResult = null;
    },
    clearInstallmentList: (state) => {
      state.installmentList = null;
    },
    clearHostedPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.hostedPayment = null;
    },
    setHostedPaymentError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hostedPageDoPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hostedPageDoPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.hostedPaymentResult = action.payload;
        state.error = null;
      })
      .addCase(hostedPageDoPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getInstallments.fulfilled, (state, action) => {
        state.installmentList = action.payload;
        state.error = null;
      })
      .addCase(getHostedPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHostedPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.hostedPayment = action.payload;
        state.error = null;
      })
      .addCase(getHostedPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearHostedPaymentResult, clearInstallmentList, clearHostedPaymentState, setHostedPaymentError } = hostedPaymentSlice.actions;
export default hostedPaymentSlice.reducer;
