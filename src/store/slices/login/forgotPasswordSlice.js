// src/store/slices/forgotPasswordSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { AUTH_URL } from "@/constants/apiUrls";
import { t } from "i18next";

export const forgotPassword = createAsyncThunk(
  "User/UserChangePasswordSendEmail",
  async (userData, { rejectWithValue }) => {
    try {
        /*
      const response = await api.post(AUTH_URL.ForgotPassword, {
          emailAdress: userData.email,
      });
      */
      const response = await api.get(`${AUTH_URL.ForgotPassword}?emailAdress=${encodeURIComponent(userData.email)}`);

      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.passwordChangeError")
      );
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    loading: false,
    error: null,
    success: false,
    userData: null,
  },
  reducers: {
    clearForgotPasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = null;
    },
    setForgotPasswordError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearForgotPasswordState, setForgotPasswordError } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
