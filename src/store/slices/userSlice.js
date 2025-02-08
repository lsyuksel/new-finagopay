import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/User/GetUsers');
      return response || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Kullanıcı verileri alınamadı');
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  initialized: false,
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  }
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.users = [];
      state.error = null;
      state.initialized = false;
      state.pagination = initialState.pagination;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Sayfa boyutu değiştiğinde ilk sayfaya dön
    },
    setPaginatedData: (state) => {
      const { currentPage, itemsPerPage } = state.pagination;
      const totalItems = state.users.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      state.pagination = {
        ...state.pagination,
        totalItems,
        totalPages
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.initialized = true;
        state.error = null;
        // Pagination bilgilerini güncelle
        const totalItems = action.payload.length;
        const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);
        state.pagination.totalItems = totalItems;
        state.pagination.totalPages = totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      });
  },
});

export const { clearUserState, setCurrentPage, setItemsPerPage, setPaginatedData } = userSlice.actions;

export const selectUsersState = (state) => state.users; // users slice'ı seçiyoruz

export const selectPaginatedUsers = createSelector(
  [selectUsersState],
  ({ users, pagination }) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  }
);

export default userSlice.reducer; 