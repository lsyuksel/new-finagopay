import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../../services/api';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  merchantId: null,
  merchantGuid: null,
  loading: false,
  error: null,
};

// Async logout thunk - API çağrısı yapar
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.logout();
      
      // localStorage'ı temizle
      localStorage.clear();
      
      // Login sayfasına yönlendir
      window.location.href = '/login';
      
      return result;
    } catch (error) {
      // Logout API hatası olsa bile localStorage'ı temizle
      localStorage.clear();
      window.location.href = '/login';
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, merchantId, merchantGuid } = action.payload;
      state.user = user;
      state.token = token;
      state.merchantId = merchantId;
      state.merchantGuid = merchantGuid;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      // Senkron logout - sadece state'i temizle
      state.user = null;
      state.token = null;
      state.merchantId = null;
      state.merchantGuid = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      // User objesini güncelle - mevcut user bilgilerini koru, yeni bilgileri ekle/güncelle
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
      console.log("state.user",state.user);
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.merchantId = null;
        state.merchantGuid = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // API hatası olsa bile state'i temizle
        state.user = null;
        state.token = null;
        state.merchantId = null;
        state.merchantGuid = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, setLoading, setError, clearError, updateUser } = authSlice.actions;

export default authSlice.reducer; 