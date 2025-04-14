// src/store/slices/registerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { AUTH_URL } from "../../constants/apiUrls";
import { t } from "i18next";

export const getUserAgreementByCreateAcount = createAsyncThunk(
  "getUserAgreementByCreateAcount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(AUTH_URL.GetUserAgreementByCreateAcount);
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
      const response = await api.post(AUTH_URL.Register, {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Phone: userData.phone,
        Email: userData.email,
        Password: userData.password,
        PasswordAgain: userData.passwordAgain,
        UserAgreements: userData.userAgreements,
      });

      return response;
    } catch (error) {
      console.log("error!!", error.response?.data?.Message);
      return rejectWithValue(
        error.response?.data?.Message || t("messages.registerError")
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
