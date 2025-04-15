import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import menuReducer from './slices/menuSlice';
import userReducer from './slices/userSlice';
import transactionReducer from './slices/transactionSlice';

import authReducer from './slices/login/authSlice';
import registerReducer from './slices/login/registerSlice';
import forgotPasswordReducer from './slices/login/forgotPasswordSlice';
import passwordChangeConfirmReducer from './slices/login/passwordChangeConfirmSlice';

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