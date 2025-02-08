import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Accounts from '../../pages/Accounts/Accounts';
import Transactions from '../../pages/Transactions/Transactions';
import Settings from '../../pages/Settings/Settings';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <Routes>
            {/* Public Routes */}
            <Route 
                path="/login" 
                element={
                    isAuthenticated 
                        ? <Navigate to="/dashboard" replace /> 
                        : <Login />
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
                path="/accounts"
                element={
                    <ProtectedRoute>
                        <Accounts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute>
                        <Transactions />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
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