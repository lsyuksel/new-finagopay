import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Sadece auth state'ini persist et
};

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  // Diğer reducer'lar buraya eklenecek
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store); 