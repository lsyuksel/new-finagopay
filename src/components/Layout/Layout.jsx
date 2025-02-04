import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Box sx={{ display: 'flex' }}>
      {isAuthenticated && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          ml: isAuthenticated ? '240px' : 0,
          mt: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout; 