// src/store/slices/registerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { AUTH_URL } from "@/constants/apiUrls";

export const getUserAgreementByCreateAcount = createAsyncThunk(
  "getUserAgreementByCreateAcount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.get(AUTH_URL.GetUserAgreementByCreateAcount);
      console.log("response",response)
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || t("messages.error")
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.post(AUTH_URL.Register, {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Phone: userData.phoneCode + userData.phone,
        Email: userData.email,
        Password: userData.password,
        PasswordAgain: userData.passwordAgain,
        UserAgreements: userData.agreements,
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    error: null,
    success: false,
    userAgreement: null,
    userData: null,
  },
  reducers: {
    clearRegisterState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = null;
    },
    setRegisterError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAgreementByCreateAcount.fulfilled, (state, action) => {
        state.userAgreement = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegisterState, setRegisterError } = registerSlice.actions;
export default registerSlice.reducer;
