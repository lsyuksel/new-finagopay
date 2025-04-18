// src/store/slices/linkPaymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../constants/apiUrls";
/*
export const getLinkPayment = createAsyncThunk(
  "MerchantLinkPayment/GetLink",
  async (userData, { rejectWithValue }) => {
    
    try {

        const paramsArray = [
            String.fromCharCode(userData.charCodeAt(4) + 3),
            String.fromCharCode(userData.charCodeAt(5) + 3),
            String.fromCharCode(userData.charCodeAt(2) + 3),
            String.fromCharCode(userData.charCodeAt(0) + 3),
            String.fromCharCode(userData.charCodeAt(1) + 3),
            String.fromCharCode(userData.charCodeAt(3) + 3),
            String.fromCharCode(userData.charCodeAt(1) + 1),
            String.fromCharCode(userData.charCodeAt(1) + 1),
            userData
        ];
        console.log("paramsArray",paramsArray);
        
        const response = await api.get(`${MERCHANT_LINK_PAYMENT.GetLink}?t=${paramsArray[0]}&k=${paramsArray[1]}&a=${paramsArray[2]}&l=${paramsArray[3]}&f=${paramsArray[4]}&c=${paramsArray[5]}&y=${paramsArray[6]}&q=${paramsArray[7]}&m=${paramsArray[8]}`);
        console.log("response",response)

        return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.linkPaymentError")
      );
    }
  }
);
*/
export const getLinkPayment = createAsyncThunk(
    "MerchantLinkPayment/GetLink",
    async (userData, { rejectWithValue }) => {
      try {
        const paramsArray = Array.from({ length: 9 }, (_, index) => {
          const charIndex = [4, 5, 2, 0, 1, 3, 1, 1, null][index];
          return charIndex !== null ? String.fromCharCode(userData.charCodeAt(charIndex) + (index < 6 ? 3 : 1)) : userData;
        });
        //console.log("paramsArray", paramsArray);
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
  },
  reducers: {
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

export const { clearLinkPaymentState, setLinkPaymentError } = linkPaymentSlice.actions;
export default linkPaymentSlice.reducer;
