import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import menuReducer from './slices/menuSlice';

import authReducer from './slices/login/authSlice';
import registerReducer from './slices/login/registerSlice';
import forgotPasswordReducer from './slices/login/forgotPasswordSlice';
import passwordChangeConfirmReducer from './slices/login/passwordChangeConfirmSlice';

import linkPaymentListReducer from './slices/linkPayment/linkPaymentListSlice';
import linkPaymentReducer from './slices/linkPayment/linkPaymentSlice';
import linkPaymentDetailReducer from './slices/linkPayment/linkPaymentDetailSlice';

import transactionListReducer from './slices/transaction-managment/transactionListSlice';
import transactionDetailReducer from './slices/transaction-managment/transactionDetailSlice';

import merchantReconciliationListReducer from './slices/reports/merchantReconciliationSlice';

import selectOptionsReducer from './slices/selectOptionSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
  passwordChangeConfirm: passwordChangeConfirmReducer,
  
  selectOptions: selectOptionsReducer,

  linkPaymentList: linkPaymentListReducer,
  linkPayment: linkPaymentReducer,
  linkPaymentDetail: linkPaymentDetailReducer,
  
  transactionList: transactionListReducer,
  transactionDetail: transactionDetailReducer,
  
  merchantReconciliationList: merchantReconciliationListReducer,

  menu: menuReducer,
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