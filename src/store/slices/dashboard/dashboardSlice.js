// src/store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { DASHBOARD_URL } from "../../../constants/apiUrls";

export const getDashboard = createAsyncThunk(
  "MerchantDashboard/GetDashboard",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(DASHBOARD_URL.GetDashboard, {...userData});
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.error")
      );
    }
  }
);

export const getGraphicData = createAsyncThunk(
  "MerchantDashboard/getGraphicData",
  async (userData, { rejectWithValue }) => {
    // try {
    //   const response = await api.post(DASHBOARD_URL.GetDashboard, {...userData});
    //   return response;
    // } catch (error) {
    //   return rejectWithValue(
    //     parseErrorResponse(error.response.data).message || t("messages.error")
    //   );
    // }
    const demoGraphicData = {
        months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
        allTransactions: [1000000, 700000, 1250000, 900000, 550000, 800000, 650000, 850000, 750000, 1000000, 600000, 1200000],
        suspiciousTransactions: [900000, 600000, 1000000, 900000, 550000, 700000, 850000, 1000000, 1100000, 1250000, 800000, 1000000],
        refundTransactions: [950000, 800000, 1000000, 750000, 850000, 1000000, 1100000, 1200000, 1300000, 900000, 700000, 850000],
        disputes: [700000, 750000, 800000, 850000, 800000, 750000, 700000, 750000, 800000, 850000, 800000, 750000]
    };

    return demoGraphicData;
  }
);

const dashboardSlice = createSlice({
  name: "homeDashboard",
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: [],
    graphicData: [],
    deleteSuccess: false,
  },
  reducers: {
    clearDashboardState: (state) => {
      state.loading = false;
      state.deleteSuccess = false,
      state.error = null;
      state.success = false;
      state.data = null;
      state.graphicData = null;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(getDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getGraphicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGraphicData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.graphicData = action.payload;
        state.error = null;
      })
      .addCase(getGraphicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardState, setDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
