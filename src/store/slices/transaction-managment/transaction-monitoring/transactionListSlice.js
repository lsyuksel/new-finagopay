// src/store/slices/transactionListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { TRANSACTION_URL } from "../../../../constants/apiUrls";

export const getTransactionList = createAsyncThunk(
  "TransactionProvision/GetTransactionProvisionSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionProvisionSearch, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

const transactionListSlice = createSlice({
  name: "transactionList",
  initialState: {
    loading: false,
    error: null,
    success: false,
    transactionList: [],
    deleteSuccess: false,
  },
  reducers: {
    clearTransactionListState: (state) => {
      state.loading = false;
      state.deleteSuccess = false,
      state.error = null;
      state.success = false;
      state.transactionList = null;
    },
    setTransactionListError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getTransactionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.transactionList = action.payload;
        state.error = null;
      })
      .addCase(getTransactionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionListState, setTransactionListError } = transactionListSlice.actions;
export default transactionListSlice.reducer;
