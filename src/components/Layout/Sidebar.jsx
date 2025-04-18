import { Link, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '../../store/slices/login/authSlice';
import { fetchMenuItems, toggleMenuItem } from '../../store/slices/menuSlice';
import { startTransition, useCallback, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import logo from '@assets/images/logo.png'
import smallLogo from '@assets/images/small-logo.png'
import supportIcon from '@assets/images/icons/support.svg'

const Sidebar = () => {
  const { toggleSidebarStatus } = useSelector((state) => state.menu);
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
      navigate(toKebabCase(item.children[0].pageUrl));
    } else if (item.pageUrl) {
      navigate(toKebabCase(item.pageUrl));
    }
  };

  const renderMenuItem = (item) => {
    if (!item) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    return (
      <div className='menu-item' key={item.id}>
        <Nav.Link
          onClick={() => handleMenuClick(item)}
          className={`menu-button`}
        >
          <div>
            {item.pageIcon && hasChildren && (
              <i className={`${item.pageIcon} menu-icon`} />
            )}
            <span>{t(`menu.${item.pageName?.toLowerCase()}`, item.pageName)}</span>
          </div>
          {hasChildren && (
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} />
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
    <div className={`sidebar${toggleSidebarStatus ? ' sidebar-small' : ''}`}>
      <div className="sidebar-logo">
          <Link to={'/'}>
            <img src={logo} alt="" />
            <div className="small-logo"><img src={smallLogo} alt="" /></div>
          </Link>
      </div>
      <div className="sidebar-content">
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
          )
          : (
            <div className="empty-message">
              {t('menu.empty')}
            </div>
          )}
          <div className='menu-item'>
            <Link onClick={handleLogout} className={`menu-button`}>
              <div>
                <i className='pi pi-power-off menu-icon'></i>
                <span>{t('menu.logout')}</span>
              </div>
            </Link>
          </div>
          <div className='menu-item'>
            <Link to={"/support"} className={`menu-button`}>
              <div>
                <i className='pi pi-headphones menu-icon'></i>
                <span>{t('menu.support')}</span>
              </div>
            </Link>
          </div>
        </Nav>
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-support-box">
          <div className="support-icon">
            <img src={supportIcon} alt="" />
          </div>
          <div className='support-title' dangerouslySetInnerHTML={{ __html: t("menu.supportBoxTitle") }} />
          <div className="support-text">{t('menu.supportBoxText')}</div>
          <Link to={'/'} className="support-button">{t('menu.supportBoxButton')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 