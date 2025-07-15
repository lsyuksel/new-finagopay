import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import MerchantApplication from "../../pages/ApplicationManagement/MerchantApplication";
import TransactionMonitoring from "../../pages/Transaction/TransactionManagement/TransactionMonitoring";
import DetailTransaction from "../../pages/Transaction/TransactionManagement/DetailTransaction";

import RefundTransactionMonitoring from "../../pages/Transaction/RefundTransactionMonitoring/RefundTransactionMonitoring";
import DetailRefundTransaction from "../../pages/Transaction/RefundTransactionMonitoring/DetailRefundTransaction";

import SuspiciousTransactionMonitoring from "../../pages/Transaction/SuspiciousTransactionMonitoring/SuspiciousTransactionMonitoring";
import DetailSuspiciousTransaction from "../../pages/Transaction/SuspiciousTransactionMonitoring/DetailSuspiciousTransaction";

import ChargebackMonitoring from "../../pages/Transaction/ChargebackMonitoring/ChargebackMonitoring";
import DetailChargeback from "../../pages/Transaction/ChargebackMonitoring/DetailChargeback";


import MerchantReconciliation from "../../pages/Reports/ReconciliationManagement/MerchantReconciliation";
import MerchantCommissionList from "../../pages/Settings/InstallmentAndCommissionManagement/MerchantCommissionList";
import KeyDefinition from "../../pages/Settings/KeyManagement/KeyDefinition";
import UserDefinition from "../../pages/Settings/UserManagement/UserDefinition";
import UserRoleRelation from "../../pages/Settings/UserManagement/UserRoleRelation";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../../pages/Login/AuthLayout";
import ForgotPassword from "../../pages/Login/ForgotPassword";
import PasswordChangeConfirm from "../../pages/Login/PasswordChangeConfirm";
import LinkPaymentList from "../../pages/LinkPayment/LinkPaymentList/LinkPaymentList";
import LinkPayment from "../../pages/LinkPayment/Paylink/LinkPayment";
import DetailLinkPayment from "../../pages/LinkPayment/LinkPaymentList/DetailLinkPayment";
import CreateLinkPayment from "../../pages/LinkPayment/LinkPaymentList/CreateLinkPayment";
import Layout from "../Layout/Layout";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>

      {/* Protected Routes */}


      {/* dashboard */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* merchantapplication */}
        <Route
          path="/merchant-application"
          element={
            <ProtectedRoute>
              <MerchantApplication />
            </ProtectedRoute>
          }
        />



        {/* transaction */}
        <Route
          path="/transaction-monitoring"
          element={
            <ProtectedRoute>
              <TransactionMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-transaction/:param"
          element={
            <ProtectedRoute>
              <DetailTransaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/refund-transaction-monitoring"
          element={
            <ProtectedRoute>
              <RefundTransactionMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-refund-transaction/:param"
          element={
            <ProtectedRoute>
              <DetailRefundTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suspicious-transaction-monitoring"
          element={
            <ProtectedRoute>
              <SuspiciousTransactionMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-suspicious-transaction/:param"
          element={
            <ProtectedRoute>
              <DetailSuspiciousTransaction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chargeback-monitoring"
          element={
            <ProtectedRoute>
              <ChargebackMonitoring />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-chargeback/:param"
          element={
            <ProtectedRoute>
              <DetailChargeback />
            </ProtectedRoute>
          }
        />




        {/* link payment */}
        <Route
          path="/link-payment-list"
          element={
            <ProtectedRoute>
              <LinkPaymentList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-payment/:param"
          element={
            <ProtectedRoute>
              <DetailLinkPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-link-payment"
          element={
            <ProtectedRoute>
              <CreateLinkPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-link-payment/new"
          element={
            <ProtectedRoute>
              <DetailLinkPayment />
            </ProtectedRoute>
          }
        />





        {/* reports */}
        <Route
          path="/transaction-reports"
          element={
            <ProtectedRoute>
              <MerchantReconciliation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant-reconciliation"
          element={
            <ProtectedRoute>
              <MerchantReconciliation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice-reports"
          element={
            <ProtectedRoute>
              <MerchantReconciliation />
            </ProtectedRoute>
          }
        />



        {/* settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-definition"
          element={
            <ProtectedRoute>
              <UserDefinition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/key-definition"
          element={
            <ProtectedRoute>
              <KeyDefinition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant-commission-list"
          element={
            <ProtectedRoute>
              <MerchantCommissionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-role-relation"
          element={
            <ProtectedRoute>
              <UserRoleRelation />
            </ProtectedRoute>
          }
        />
        
        {/* * */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>

      
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthLayout page="login" />
          )
        }
      />
      <Route path="/register" element={<AuthLayout page="register" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/passwordChangeConfirm" element={<PasswordChangeConfirm />} />
     
      <Route path="/linkpayment/:param" element={<LinkPayment />} />

    </Routes>
  );
};

export default AppRoutes;
