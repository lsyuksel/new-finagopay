// src/store/slices/passwordChangeConfirm.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "../../services/api";
import { AUTH_URL } from "../../constants/apiUrls";
import { t } from "i18next";

export const passwordChangeConfirm = createAsyncThunk(
  "User/UpdateUserNewPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const userResponse = await api.get(`${AUTH_URL.GetUser}?token=${encodeURIComponent(userData.token)}`)
      try {
        const response = await api.put(AUTH_URL.UpdateUserNewPassword, {
          userGuid: userResponse.guid,
          newPassword: userData.password,
        });
        return response;
      } catch (error) {
        return rejectWithValue(
          parseErrorResponse(error.response.data).message || t("messages.passwordChangeError")
        );
      }
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.passwordChangeError")
      );
    }
  }
);

const passwordChangeConfirmSlice = createSlice({
  name: "passwordChangeConfirm",
  initialState: {
    loading: false,
    error: null,
    success: false,
    userData: null,
  },
  reducers: {
    clePrpasswordChangeConfirmState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = null;
    },
    setPasswordChangeConfirmError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(passwordChangeConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(passwordChangeConfirm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(passwordChangeConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPasswordChangeConfirmState, setPasswordChangeConfirmError } = passwordChangeConfirmSlice.actions;
export default passwordChangeConfirmSlice.reducer;
