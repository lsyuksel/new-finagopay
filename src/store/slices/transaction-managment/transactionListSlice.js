// src/store/slices/transactionListSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { TRANSACTION_URL } from "../../../constants/apiUrls";
import { toast } from "react-toastify";

export const getTransactionList = createAsyncThunk(
  "UnifiedTransaction/GetTransactionList",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionList, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);
export const getTransactionSearchList = createAsyncThunk(
  "UnifiedTransaction/GetTransactionSearchList",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionSearchList, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);


export const cancelTransaction = createAsyncThunk(
  "UnifiedTransaction/CancelTransaction",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.CancelTransaction, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const refundTransaction = createAsyncThunk(
  "UnifiedTransaction/RefundTransaction",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.RefundTransaction, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const getTransactionReceipt = createAsyncThunk(
  "UnifiedTransaction/GetTransactionReceipt",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(TRANSACTION_URL.GetTransactionReceipt, {...userData});
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
    filteredList: [],
    transactionReceiptData: null,
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
      })

      
      .addCase(getTransactionSearchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionSearchList.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(getTransactionSearchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(getTransactionReceipt.pending, (state) => {
        state.error = null;
      })
      .addCase(getTransactionReceipt.fulfilled, (state, action) => {
        state.success = true;
        state.transactionReceiptData = action.payload;
        state.error = null;
      })
      .addCase(getTransactionReceipt.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(state.error);
      });


      
  },
});

export const { clearTransactionListState, setTransactionListError } = transactionListSlice.actions;
export default transactionListSlice.reducer;
