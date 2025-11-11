import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, token } = useSelector((state) => state.auth);
    
    // Token'ı Redux state'ten veya localStorage'dan al
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('accessToken');

    if (!isAuthenticated || !authToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 