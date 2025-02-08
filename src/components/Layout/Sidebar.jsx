import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, Button, Select, MenuItem, FormControl, InputLabel, Collapse, CircularProgress } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/authSlice';
import { fetchMenuItems, toggleMenuItem } from '../../store/slices/menuSlice';
import { startTransition, useCallback, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';

const drawerWidth = 320;

const Sidebar = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items = [], loading, error, expandedItems, initialized } = useSelector((state) => {
    return state.menu;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isAuthenticated && !initialized && !loading) {
      dispatch(fetchMenuItems());
    }
  }, [dispatch, isAuthenticated, initialized, loading]);

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

  const toKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };
  
  const handleMenuClick = (item) => {
    if (item.children?.length > 0) {
      dispatch(toggleMenuItem(item.id));
    } else if (item.pageUrl) {
      navigate(toKebabCase(item.pageUrl));
    }
  };

  const renderMenuItem = (item) => {
    if (!item) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    return (
      <Box key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleMenuClick(item)}
            sx={{
              pl: item.level ? item.level * 2 : 1,
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
              minHeight: '48px',
            }}
          >
            {
              hasChildren && 
              <Box sx={{ mr: 2, width: 24, textAlign: 'center' }}>
                <i className={item.pageIcon} style={{ color: '#1976d2', fontSize: '1.25rem' }} />
              </Box>
            }
            <ListItemText
              primary={t(`menu.${item.pageName?.toLowerCase()}`, item.pageName)}
              sx={{ 
                color: '#333',
                '& .MuiTypography-root': {
                  fontSize: '0.875rem',
                  fontWeight: hasChildren ? 600 : 400,
                }
              }}
            />
            {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem({ ...child, level: (item.level || 0) + 1 }))}
            </List>
          </Collapse>
        )}
      </Box>
    );
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>
              {t('menu.error')}
            </Typography>
          ) : Array.isArray(items) && items.length > 0 ? (
            items.map((item) => renderMenuItem(item))
          ) : (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              {t('menu.empty')}
            </Typography>
          )}
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