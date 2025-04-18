import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TopHeader from './TopHeader';
import BottomFooter from './BottomFooter';

const Layout = ({ children }) => {
  const authData = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log("authData",authData)
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