// src/store/slices/linkPaymentDetailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../constants/apiUrls";

export const getMerchantLinkPayment = createAsyncThunk(
  "MerchantLinkPayment/GetMerchantLinkPayment",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.get(`${MERCHANT_LINK_PAYMENT.GetMerchantLinkPayment}?guid=${userData}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

export const insertMerchantLinkPayment = createAsyncThunk(
  "MerchantLinkPayment/InsertMerchantLinkPayment",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_LINK_PAYMENT.InsertMerchantLinkPayment, userData);
      return response;
    } catch (error) {
      console.log("error!2",error)
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

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

const linkPaymentDetailSlice = createSlice({
  name: "linkPaymentDetail",
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  reducers: {
    saveDetailData: (state,action) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = action.payload;
    },
    clearLinkPaymentDetailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
    },
    setLinkPaymentDetailError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Detail page State
      .addCase(getMerchantLinkPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantLinkPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getMerchantLinkPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      //Update State
      .addCase(updateMerchantLinkPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMerchantLinkPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateMerchantLinkPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Create State
      .addCase(insertMerchantLinkPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertMerchantLinkPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(insertMerchantLinkPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLinkPaymentDetailState, setLinkPaymentDetailError, saveDetailData } = linkPaymentDetailSlice.actions;
export default linkPaymentDetailSlice.reducer;
