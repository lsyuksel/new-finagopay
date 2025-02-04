import { Link, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'Hesaplar',
    icon: <AccountBalanceIcon />,
    path: '/accounts'
  },
  {
    title: 'İşlemler',
    icon: <ReceiptIcon />,
    path: '/transactions'
  },
  {
    title: 'Ayarlar',
    icon: <SettingsIcon />,
    path: '/settings'
  }
];

const drawerWidth = 320;

const Sidebar = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#AB63BF',
          color: 'white'
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h6" component="div" sx={{ color: 'white' }}>
            Finago Pay
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.title}
              component={Link}
              to={item.path}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText sx={{ color: 'white' }} primary={item.title} />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{ color: 'white', mt: 2, width: '100%' }}
        >
          Çıkış Yap
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 