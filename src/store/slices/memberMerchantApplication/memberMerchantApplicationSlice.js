import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { t } from "i18next";
import { MERCHANT_APPLICATION } from "../../../constants/apiUrls";
import { getApiErrorMessage } from "@/utils/helpers";

export const submitMemberMerchantApplication = createAsyncThunk(
  "MerchantApplication/InsertMerchantApplication",
  async (applicationData, { rejectWithValue }) => {
    try {
      // File objelerini ayır
      const fileMap = applicationData._fileMap || new Map();
      delete applicationData._fileMap;
      
      // FormData oluştur (binary dosyalar için)
      const formData = new FormData();
      
      // Normal field'ları ekle
      Object.keys(applicationData).forEach((key) => {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        const value = applicationData[key];
        
        // UploadDocumentList array ise özel işleme
        if (key === 'UploadDocumentList' && Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item.DocumentType !== undefined) {
              formData.append(`UploadDocumentList[${index}].DocumentType`, item.DocumentType);
            }
            // File objesini ekle
            const file = fileMap.get(index);
            if (file) {
              formData.append(`UploadDocumentList[${index}].File`, file);
            }
          });
          return;
        }
        
        // Diğer field'ları ekle
        if (value !== null && value !== undefined) {
          formData.append(capitalizedKey, value);
        }
      });
      
      const response = await api.post(
        MERCHANT_APPLICATION.InsertMerchantApplication,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // timeout: 60000, // 60 saniye timeout (dosya yükleme için)
        }
      );
      
      return response;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

const memberMerchantApplicationSlice = createSlice({
  name: "memberMerchantApplication",
  initialState: {
    loading: false,
    error: null,
    success: false,
    applicationData: null,
  },
  reducers: {
    clearApplicationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.applicationData = null;
    },
    setApplicationError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitMemberMerchantApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitMemberMerchantApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.applicationData = action.payload;
        state.error = null;
      })
      .addCase(submitMemberMerchantApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationState, setApplicationError } =
  memberMerchantApplicationSlice.actions;
export default memberMerchantApplicationSlice.reducer;

