// src/store/slices/userDefinitionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { SETTINGS_URL } from "../../../constants/apiUrls";

export const getProfile = createAsyncThunk(
  "/MerchantUserProfile/GetProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.GetProfile, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);


export const changePasswordProfile = createAsyncThunk(
  "/MerchantUserProfile/ChangePasswordProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.ChangePasswordProfile, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const changePasswordProfileVerify = createAsyncThunk(
  "/MerchantUserProfile/ChangePasswordProfileVerify",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.ChangePasswordProfileVerify, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const getMerchantProfileActivityLog = createAsyncThunk(
  "/MerchantUserProfile/GetMerchantProfileActivityLog",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(SETTINGS_URL.GetMerchantProfileActivityLog, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

const userDefinitionSlice = createSlice({
  name: "userDefinition",
  initialState: {
    loading: false,
    error: null,
    success: false,
    profileData: null,
    activityLogData: null,
    
  },
  reducers: {
    clearUserDefinitionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.profileData = null;
      state.activityLogData = null;
    },
    setUserDefinitionError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Detail page State
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profileData = action.payload;
        state.error = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePasswordProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(changePasswordProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getMerchantProfileActivityLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMerchantProfileActivityLog.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.activityLogData = action.payload;
        state.error = null;
      })
      .addCase(getMerchantProfileActivityLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearUserDefinitionState, setUserDefinitionError, saveDetailData } = userDefinitionSlice.actions;
export default userDefinitionSlice.reducer;
