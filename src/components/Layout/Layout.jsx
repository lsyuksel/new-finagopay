import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import './Layout.scss';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Layout = ({ children }) => {
  const authData = useSelector((state) => state.auth);
  
  useEffect(() => {
    console.log("authData",authData)
  }, [authData])
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout; 