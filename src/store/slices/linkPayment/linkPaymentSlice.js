// src/store/slices/linkPaymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../constants/apiUrls";

export const payLink = createAsyncThunk(
  "/MerchantLinkPayment/PayLink",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_LINK_PAYMENT.PayLink, {
        merchantInfo: {
            nameSurname: userData.nameSurname,
            phoneNumber: userData.phoneCode + userData.phoneNumber,
            email: userData.email,
            address: userData.address
        },
        cardHolder: userData.cardHolder,
        cardNumber: userData.cardNumber,
        expireDate: userData.expireDate,
        cvv: userData.cvv,
        linkKey: userData.linkKey,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const getInstallments = createAsyncThunk(
  "/Installment/GetInstallments",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_LINK_PAYMENT.GetInstallments, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

export const getLinkPayment = createAsyncThunk(
    "MerchantLinkPayment/GetLink",
    async (userData, { rejectWithValue }) => {
      try {
        const paramsArray = Array.from({ length: 9 }, (_, index) => {
          const charIndex = [4, 5, 2, 0, 1, 3, 1, 1, null][index];
          return charIndex !== null ? String.fromCharCode(userData.charCodeAt(charIndex) + (index < 6 ? 3 : 1)) : userData;
        });
        const response = await api.get(`${MERCHANT_LINK_PAYMENT.GetLink}?t=${paramsArray[0]}&k=${paramsArray[1]}&a=${paramsArray[2]}&l=${paramsArray[3]}&f=${paramsArray[4]}&c=${paramsArray[5]}&y=${paramsArray[6]}&q=${paramsArray[7]}&m=${paramsArray[8]}`);
        return response;
      } catch (error) {
        return rejectWithValue(
          parseErrorResponse(error.response.data).message || t("messages.linkPaymentError")
        );
      }
    }
);

const linkPaymentSlice = createSlice({
  name: "linkPayment",
  initialState: {
    loading: false,
    error: null,
    success: false,
    payment: null,
    installmentList: null,
    payLinkResult: null,
  },
  reducers: {
    clearPayLinkResult: (state) => {
      state.payLinkResult = null;
    },
    clearInstallmentList: (state) => {
      state.installmentList = null;
    },
    clearLinkPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.payment = null;
    },
    setLinkPaymentError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payLink.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.payLinkResult = action.payload;
        state.error = null;
      })
      .addCase(payLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getInstallments.fulfilled, (state, action) => {
        state.installmentList = action.payload;
        state.error = null;
      })
      .addCase(getLinkPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLinkPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.payment = action.payload;
        state.error = null;
      })
      .addCase(getLinkPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPayLinkResult, clearInstallmentList, clearLinkPaymentState, setLinkPaymentError } = linkPaymentSlice.actions;
export default linkPaymentSlice.reducer;
