import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout/Layout';
import AppRoutes from './components/Routes';
import './App.scss';

function App() {
    return (
        <Router>
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
            <AppRoutes />
        </Router>
    );
}

export default App;
