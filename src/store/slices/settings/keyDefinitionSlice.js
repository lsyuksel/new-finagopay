// src/store/slices/keyDefinitionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { SETTINGS_URL } from "../../../constants/apiUrls";

export const merchantGetProfile = createAsyncThunk(
  "/MerchantProfile/GetProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.get(`${SETTINGS_URL.MerchantGetProfile}?merchantId=${userData}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const merchantGetKeys = createAsyncThunk(
  "/MerchantProfile/GetKeys",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.get(`${SETTINGS_URL.MerchantGetKeys}?merchantId=${userData}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const merchantUpdateKeys = createAsyncThunk(
  "/MerchantProfile/UpdateKeys",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put(SETTINGS_URL.MerchantUpdateKeys, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const merchantInsertLogo = createAsyncThunk(
  "/MerchantProfile/InsertLogo",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.MerchantInsertLogo, userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

const keyDefinitionSlice = createSlice({
  name: "keyDefinition",
  initialState: {
    loading: false,
    error: null,
    success: false,
    merchantProfile: null,
    merchantKeys: null,

  },
  reducers: {
    cleKrkeyDefinitionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.merchantProfile = null;
      state.merchantKeys = null;
    },
    setKeyDefinitionError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Detail page State
      .addCase(merchantGetProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(merchantGetProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchantProfile = action.payload;
        state.error = null;
      })
      .addCase(merchantGetProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(merchantGetKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(merchantGetKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchantKeys = action.payload;
        state.error = null;
      })
      .addCase(merchantGetKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      
      .addCase(merchantUpdateKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(merchantUpdateKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.merchantKeys = action.payload;
        state.error = null;
      })
      .addCase(merchantUpdateKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearKeyDefinitionState, setKeyDefinitionError, saveDetailData } = keyDefinitionSlice.actions;
export default keyDefinitionSlice.reducer;
