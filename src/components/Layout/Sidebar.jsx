import { useNavigate } from 'react-router-dom';
import { Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/authSlice';
import { fetchMenuItems, toggleMenuItem } from '../../store/slices/menuSlice';
import { startTransition, useCallback, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

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
      <div key={item.id}>
        <Nav.Link
          onClick={() => handleMenuClick(item)}
          className={`d-flex align-items-center ${item.level ? 'ps-' + (item.level * 3) : ''}`}
        >
          {item.pageIcon && hasChildren && (
            <i className={`${item.pageIcon} menu-icon`} />
          )}
          <span>{t(`menu.${item.pageName?.toLowerCase()}`, item.pageName)}</span>
          {hasChildren && (
            <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} ms-auto`} />
          )}
        </Nav.Link>
        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children.map((child) => renderMenuItem({ ...child, level: (item.level || 0) + 1 }))}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">FinagoPay</div>

      <Nav className="flex-column">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{t('menu.loading')}</span>
            </div>
          </div>
        ) : error ? (
          <div className="error-message">
            {t('menu.error')}
          </div>
        ) : Array.isArray(items) && items.length > 0 ? (
          items.map((item) => renderMenuItem(item))
        ) : (
          <div className="empty-message">
            {t('menu.empty')}
          </div>
        )}
      </Nav>
      <div className="p-3 border-top">
        <LanguageSelector />
      </div>
      <div className="px-3">
        <Button
          variant="primary"
          onClick={handleLogout}
          className="w-100"
        >
          {t('common.logout')}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 