import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Accounts from '../../pages/Accounts/Accounts';
import Transactions from '../../pages/Transactions/Transactions';
import Settings from '../../pages/Settings/Settings';
import ProtectedRoute from './ProtectedRoute'; // Eğer ayrı bir dosyada tanımladıysanız

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes; 