import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { MERCHANT_AGREEMENT, MERCHANT_APPLICATION } from "../../../constants/apiUrls";
import { getApiErrorMessage } from "@/utils/helpers";

export const getMerchantAgreementForApproval = createAsyncThunk(
  "MerchantAgreement/GetMerchantAgreementForApproval",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(MERCHANT_AGREEMENT.GetMerchantAgreementForApproval);
      return response;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserCanApproveAgreement = createAsyncThunk(
  "MerchantApplication/GetUserCanApproveAgreement",
  async (userName, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_APPLICATION.GetUserCanApproveAgreement, {
        userName: userName
      });
      return response;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const approveMerchantAgreement = createAsyncThunk(
  "MerchantApplication/ApproveMerchantAgreement",
  async (approvalData, { rejectWithValue }) => {
    try {
      const response = await api.post(MERCHANT_AGREEMENT.ApproveMerchantAgreement, approvalData);
      return response;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const merchantAgreementSlice = createSlice({
  name: "merchantAgreement",
  initialState: {
    agreements: null,
    agreementsLoading: false,
    agreementsError: null,
    approvalLoading: false,
    approvalError: null,
    approvalSuccess: false,
    canApproveAgreement: null,
    canApproveLoading: false,
    canApproveError: null,
  },
  reducers: {
    clearAgreementState: (state) => {
      state.agreements = null;
      state.agreementsLoading = false;
      state.agreementsError = null;
      state.approvalLoading = false;
      state.approvalError = null;
      state.approvalSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMerchantAgreementForApproval.pending, (state) => {
        state.agreementsLoading = true;
        state.agreementsError = null;
      })
      .addCase(getMerchantAgreementForApproval.fulfilled, (state, action) => {
        state.agreementsLoading = false;
        state.agreements = action.payload;
        state.agreementsError = null;
      })
      .addCase(getMerchantAgreementForApproval.rejected, (state, action) => {
        state.agreementsLoading = false;
        state.agreementsError = action.payload;
      })
      .addCase(getUserCanApproveAgreement.pending, (state) => {
        state.canApproveLoading = true;
        state.canApproveError = null;
      })
      .addCase(getUserCanApproveAgreement.fulfilled, (state, action) => {
        state.canApproveLoading = false;
        state.canApproveAgreement = action.payload?.canApproveAgreement ?? null;
        state.canApproveError = null;
      })
      .addCase(getUserCanApproveAgreement.rejected, (state, action) => {
        state.canApproveLoading = false;
        state.canApproveError = action.payload;
      })
      .addCase(approveMerchantAgreement.pending, (state) => {
        state.approvalLoading = true;
        state.approvalError = null;
        state.approvalSuccess = false;
      })
      .addCase(approveMerchantAgreement.fulfilled, (state, action) => {
        state.approvalLoading = false;
        state.approvalSuccess = true;
        state.approvalError = null;
      })
      .addCase(approveMerchantAgreement.rejected, (state, action) => {
        state.approvalLoading = false;
        state.approvalError = action.payload;
        state.approvalSuccess = false;
      });
  },
});

export const { clearAgreementState } = merchantAgreementSlice.actions;
export default merchantAgreementSlice.reducer;

