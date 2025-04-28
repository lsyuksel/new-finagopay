import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TopHeader from './TopHeader';
import BottomFooter from './BottomFooter';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const authData = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  
  useEffect(() => {
    console.log("authData",authData);
    console.log("pathname",pathname);
  }, [authData])
  
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <TopHeader />
        <div className="main-content">
          {children}
        </div>
        <BottomFooter />
      </main>
    </div>
  );
};

export default Layout; 