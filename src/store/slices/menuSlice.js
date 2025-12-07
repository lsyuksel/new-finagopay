import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

// Async thunk for fetching menu data
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/System/GetMenuTreeList');
      
      // API yanıtını işle
      const processMenuItems = (items) => {
        return items.map(item => ({
          id: item.guid,
          pageName: item.pageName,
          pageIcon: item.pageIcon,
          pageUrl: item.pageUrl,
          displayOrder: item.displayOrder,
          children: item.subPageModel ? processMenuItems(item.subPageModel) : null
        }));
      };

      const menuData = processMenuItems(response || []);
      
      return menuData;
    } catch (error) {
      console.error('Menu API Error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Menü verileri alınamadı');
    }
  }
);

const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
}

const initialState = {
  toggleSidebarStatus: false,
  items: [],
  loading: false,
  error: null,
  expandedItems: [], // Açık olan menü öğelerini takip etmek için
  initialized: false, // Menünün ilk kez yüklenip yüklenmediğini takip etmek için
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.toggleSidebarStatus = action.payload;
      /* Test notification
        toast.success("MoorLink oluşturma işleminiz başarıyla gerçekleşti.");
        toast.info("MoorLink oluşturma işleminiz başarıyla gerçekleşti.");
        toast.warn("MoorLink oluşturma işleminiz başarıyla gerçekleşti.");
        toast.error("MoorLink oluşturma işleminiz başarıyla gerçekleşti.");
      */
    },
    toggleMenuItem: (state, action) => {
      const itemId = action.payload;
      const isExpanded = state.expandedItems.includes(itemId);
      
      if (isExpanded) {
        state.expandedItems = state.expandedItems.filter(id => id !== itemId);
      } else {
        state.expandedItems = [];
        state.expandedItems.push(itemId);
      }
    },
    clearMenuState: (state) => {
      state.items = [];
      state.expandedItems = [];
      state.error = null;
      state.initialized = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload.sort((a, b) => a.displayOrder - b.displayOrder) : [];
        state.initialized = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;

        logout();
      });
  },
});

export const { toggleSidebar, toggleMenuItem, clearMenuState } = menuSlice.actions;
export default menuSlice.reducer; 