import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/authSlice';
import { startTransition, useCallback } from 'react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    title: 'Accounts',
    icon: <AccountBalanceIcon />,
    path: '/accounts'
  },
  {
    title: 'Transactions',
    icon: <ReceiptIcon />,
    path: '/transactions'
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings'
  }
];

const drawerWidth = 320;

const Sidebar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleLanguageChange = useCallback((event) => {
    const newLang = event.target.value;
    startTransition(() => {
      i18n.changeLanguage(newLang);
    });
  }, [i18n]);

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
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" component="div" sx={{ color: '#1976d2' }}>
            FinagoPay
          </Typography>
        </Box>

        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={t(`menu.${item.title.toLowerCase()}`)}
                  sx={{ color: '#333' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="language-select-label">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TranslateIcon sx={{ mr: 1, fontSize: 20 }} />
                {t('common.language')}
              </Box>
            </InputLabel>
            <Select
              labelId="language-select-label"
              value={i18n.language}
              onChange={handleLanguageChange}
              label={t('common.language')}
            >
              <MenuItem value="tr">{t('common.turkish')}</MenuItem>
              <MenuItem value="en">{t('common.english')}</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {t('common.logout')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 