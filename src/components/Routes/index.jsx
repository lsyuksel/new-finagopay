import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../../pages/Login/Login";
import Dashboard from "../../pages/Dashboard/Dashboard";
import MerchantApplication from "../../pages/ApplicationManagement/MerchantApplication";
import TransactionMonitoring from "../../pages/TransactionManagement/TransactionMonitoring";
import MerchantReconciliation from "../../pages/ReconciliationManagement/MerchantReconciliation";
import ChargebackMonitoring from "../../pages/ChargebackManagement/ChargebackMonitoring";
import MerchantCommissionList from "../../pages/InstallmentAndCommissionManagement/MerchantCommissionList";
import KeyDefinition from "../../pages/KeyManagement/KeyDefinition";
import UserDefinition from "../../pages/UserManagement/UserDefinition";
import UserRoleRelation from "../../pages/UserManagement/UserRoleRelation";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../../pages/Login/AuthLayout";
import ForgotPassword from "../../pages/Login/ForgotPassword";
import PasswordChangeConfirm from "../../pages/Login/PasswordChangeConfirm";
import LinkPaymentList from "../../pages/LinkPayment/LinkPaymentList/LinkPaymentList";
import LinkPayment from "../../pages/LinkPayment/Paylink/LinkPayment";
import DetailLinkPayment from "../../pages/LinkPayment/LinkPaymentList/DetailLinkPayment";
import CreateLinkPayment from "../../pages/LinkPayment/LinkPaymentList/CreateLinkPayment";
import Layout from "../Layout/Layout";
import DetailTransaction from "../../pages/TransactionManagement/DetailTransaction";

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
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

      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/merchant-application"
          element={
            <ProtectedRoute>
              <MerchantApplication />
            </ProtectedRoute>
          }
        />
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
          path="/merchant-reconciliation"
          element={
            <ProtectedRoute>
              <MerchantReconciliation />
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
          path="/merchant-commission-list"
          element={
            <ProtectedRoute>
              <MerchantCommissionList />
            </ProtectedRoute>
          }
        />
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
          path="/create-payment"
          element={
            <ProtectedRoute>
              <CreateLinkPayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-payment/new"
          element={
            <ProtectedRoute>
              <DetailLinkPayment />
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
          path="/user-definition"
          element={
            <ProtectedRoute>
              <UserDefinition />
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
    </Routes>
  );
};

export default AppRoutes;
