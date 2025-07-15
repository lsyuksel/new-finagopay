// src/store/slices/chargebackTransactionDetailSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, parseErrorResponse } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_LINK_PAYMENT } from "../../../../constants/apiUrls";
/*
export const getChargebackTransactionDetail = createAsyncThunk(
  "Transaction/GetChargebackTransactionDetail",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.get(`${MERCHANT_LINK_PAYMENT.GetMerchantLinkPayment}?guid=${userData}`);
      return response;
    } catch (error) {
      return rejectWithValue(
        parseErrorResponse(error.response.data).message || t("messages.registerError")
      );
    }
  }
);
*/

// backend servisi geldiğinde yukarıdaki kullanılacak uygun apiye istek atılıp response return edilecek
const testData = {

    data1: [
        {
            guid: 0,
            field1 : "302012",
            field2 : "Mor POS",
            field3 : "Eray Şentürk",
            field4 : "500 TL",
            field5 : "Başarılı",
            field6 : "24.01.2025 14:00",
        }
    ],
    
    data2: [
        {
            guid: 1,
            field1 : "6 Taksit",
            field2 : "Kredi Kartı",
            field3 : "2322334340",
            field4 : "Penta Yazılım",
        }
    ],
    
    data3: [
        {
            guid: 2,
            field1 : "302012",
            field2 : "500 TL",
            field3 : "İade",
            field4 : "Başarılı",
            field5 : "Hatalı Ürün Talebi",
            field6 : "24.01.2025 14:00",
        },
        {
            guid: 3,
            field1 : "452010",
            field2 : "980 TL",
            field3 : "İade",
            field4 : "Beklemede",
            field5 : "İptal ve İade Talebi",
            field6 : "18.02.2025 18:20",
        }
    ],
    
    data4: [
        {
            guid: 4,
            field1 : "123456*****4560",
            field2 : "Eray Şentürk",
            field3 : "MasterCard",
            field4 : "Bonus",
            field5 : "Kredi Kartı",
        },
    ],
}

// backend servisi geldiğinde yukarıdaki kullanılacak uygun apiye istek atılıp response return edilecek
export const getChargebackTransactionDetail = createAsyncThunk("Transaction/GetChargebackTransactionDetail",
    async (userData, { rejectWithValue }) => {
        try {
            const response = testData;
            return response;
        } catch (error) {
        }
    }
);

const chargebackTransactionDetailSlice = createSlice({
  name: "chargebackTransactionDetail",
  initialState: {
    loading: false,
    error: null,
    success: false,
    chargebackTransactionDetail: null,
  },
  reducers: {
    clearChargebackTransactionDetailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.chargebackTransactionDetail = null;
    },
    setChargebackTransactionDetailError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Detail page State
      .addCase(getChargebackTransactionDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChargebackTransactionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.chargebackTransactionDetail = action.payload;
        state.error = null;
      })
      .addCase(getChargebackTransactionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearChargebackTransactionDetailState, setChargebackTransactionDetailError, saveDetailData } = chargebackTransactionDetailSlice.actions;
export default chargebackTransactionDetailSlice.reducer;
