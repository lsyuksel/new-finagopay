import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/Dashboard/Dashboard';
import MerchantApplication from '../../pages/ApplicationManagement/MerchantApplication';
import TransactionMonitoring from '../../pages/TransactionManagement/TransactionMonitoring';
import MerchantReconciliation from '../../pages/ReconciliationManagement/MerchantReconciliation';
import ChargebackMonitoring from '../../pages/ChargebackManagement/ChargebackMonitoring';
import MerchantCommissionList from '../../pages/InstallmentAndCommissionManagement/MerchantCommissionList';
import KeyDefinition from '../../pages/KeyManagement/KeyDefinition';
import UserDefinition from '../../pages/UserManagement/UserDefinition';
import UserRoleRelation from '../../pages/UserManagement/UserRoleRelation';
import ProtectedRoute from './ProtectedRoute';
import AuthLayout from '../../pages/Login/AuthLayout';
import ForgotPassword from '../../pages/Login/ForgotPassword';
import PasswordChangeConfirm from '../../pages/Login/PasswordChangeConfirm';

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
                    isAuthenticated 
                        ? <Navigate to="/dashboard" replace /> 
                        : <AuthLayout page='login' />
                } 
            />
            <Route 
                path="/register" 
                element={
                    <AuthLayout page='register' />
                } 
            />
            <Route 
                path="/forgot-password" 
                element={
                    <ForgotPassword />
                } 
            />
            <Route 
                path="/passwordChangeConfirm" 
                element={
                    <PasswordChangeConfirm />
                } 
            />

            {/* Protected Routes */}
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

            {/* Application Management */}
            <Route
                path="/merchant-application"
                element={
                    <ProtectedRoute>
                        <MerchantApplication />
                    </ProtectedRoute>
                }
            />

            {/* Transaction Management */}
            <Route
                path="/transaction-monitoring"
                element={
                    <ProtectedRoute>
                        <TransactionMonitoring />
                    </ProtectedRoute>
                }
            />

            {/* Reconciliation Management */}
            <Route
                path="/merchant-reconciliation"
                element={
                    <ProtectedRoute>
                        <MerchantReconciliation />
                    </ProtectedRoute>
                }
            />

            {/* Chargeback Management */}
            <Route
                path="/chargeback-monitoring"
                element={
                    <ProtectedRoute>
                        <ChargebackMonitoring />
                    </ProtectedRoute>
                }
            />

            {/* Installment & Commission Management */}
            <Route
                path="/merchant-commission-list"
                element={
                    <ProtectedRoute>
                        <MerchantCommissionList />
                    </ProtectedRoute>
                }
            />

            {/* Key Management */}
            <Route
                path="/key-definition"
                element={
                    <ProtectedRoute>
                        <KeyDefinition />
                    </ProtectedRoute>
                }
            />

            {/* User Management */}
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

            {/* Default Route */}
            <Route 
                path="/" 
                element={
                    isAuthenticated 
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                } 
            />

            {/* 404 Route */}
            <Route 
                path="*" 
                element={
                    isAuthenticated 
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                } 
            />
        </Routes>
    );
};

export default AppRoutes; 