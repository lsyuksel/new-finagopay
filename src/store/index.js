import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './slices/authSlice';
import menuReducer from './slices/menuSlice';
import userReducer from './slices/userSlice';
import registerReducer from './slices/registerSlice';
import transactionReducer from './slices/transactionSlice';
import forgotPasswordReducer from './slices/forgotPasswordSlice';
import passwordChangeConfirmReducer from './slices/passwordChangeConfirmSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  users: userReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
  passwordChangeConfirm: passwordChangeConfirmReducer,
  transaction: transactionReducer,
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