import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TopHeader from './TopHeader';

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
      </main>
    </div>
  );
};

export default Layout; 