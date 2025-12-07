// src/store/slices/settings/merchantCommissionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { SETTINGS_URL } from "../../../constants/apiUrls";
import { toast } from "react-toastify";

export const getMerchantCommissionList = createAsyncThunk(
  "PayFacCommission/GetPayFacAndMerchantCommissionDefByUserName",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.GetMerchantCommissionList, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response?.data || error.response).message || t("messages.error")
      );
    }
  }
);

export const getPayFacCommissionBankList = createAsyncThunk(
  "DomesticBankDef/GetPayFacCommissionBankListByUserName",
  async (userName, { rejectWithValue }) => {
    try {
      const response = await api.get(`${SETTINGS_URL.GetPayFacCommissionBankListByUserName}?userName=${userName}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response?.data || error.response).message || t("messages.error")
      );
    }
  }
);

export const updateMerchantCommissionDefList = createAsyncThunk(
  "MerchantCommission/UpdateMerchantCommissionDefListCommission",
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await api.put(SETTINGS_URL.UpdateMerchantCommissionDefListCommission, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response?.data || error.response).message || t("messages.error")
      );
    }
  }
);

const merchantCommissionSlice = createSlice({
  name: "merchantCommission",
  initialState: {
    loading: false,
    error: null,
    success: false,
    bankGroups: [], // Bankaları ayrı ayrı tutmak için
    originalBankData: [], // Orijinal API response'u (update için gerekli)
    bankList: [], // Yeni API'den gelen banka listesi
    totalCount: 0,
  },
  reducers: {
    clearMerchantCommissionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.bankGroups = [];
      state.originalBankData = [];
      state.bankList = [];
      state.totalCount = 0;
    },
    setMerchantCommissionError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMerchantCommissionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantCommissionList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        // API response bir array dönüyor, her eleman bir banka grubu
        // Her banka grubunu ayrı ayrı tutuyoruz
        let bankGroups = [];
        
        action.payload.forEach((item) => {
          if (item?.payFacCommissionInstallmentDefs && Array.isArray(item.payFacCommissionInstallmentDefs)) {
            bankGroups.push({
              bankGuid: item.bankGuid,
              bankName: item.bankName || item.bankName || 'Bilinmeyen Banka',
              cardType: item.cardType || item.cardTypeName || 'Bilinmeyen Kart Tipi',
              installments: item.payFacCommissionInstallmentDefs // installments olarak tutuyoruz
            });
          }
        });
        
        state.bankGroups = bankGroups;
        // Orijinal response'u sakla (update için gerekli)
        state.originalBankData = Array.isArray(action.payload) ? action.payload : (action.payload?.payFacCommissionInstallmentDefs ? [action.payload] : []);
        state.totalCount = bankGroups.reduce((total, bank) => total + (bank.installments?.length || 0), 0);
        state.error = null;
      })
      .addCase(getMerchantCommissionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || t("messages.error"));
      })
      .addCase(getPayFacCommissionBankList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayFacCommissionBankList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bankList = action.payload;
        state.error = null;
      })
      .addCase(getPayFacCommissionBankList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || t("messages.error"));
      })
      .addCase(updateMerchantCommissionDefList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMerchantCommissionDefList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(t("messages.success"));
      })
      .addCase(updateMerchantCommissionDefList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || t("messages.error"));
      });
  },
});

export const { clearMerchantCommissionState, setMerchantCommissionError } = merchantCommissionSlice.actions;
export default merchantCommissionSlice.reducer;