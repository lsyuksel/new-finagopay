import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Nav, Navbar, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../../store/slices/login/authSlice';
import { fetchMenuItems, toggleMenuItem, toggleSidebar } from '../../store/slices/menuSlice';
import { startTransition, useCallback, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import logo from '@assets/images/logo.png'
import smallLogo from '@assets/images/small-logo.png'
import supportIcon from '@assets/images/icons/support.svg'

const Sidebar = () => {
  const location = useLocation();

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
    dispatch(logoutUser());
    // navigate authService.logout içinde yapılıyor
  };

  const toKebabCase = (str) => {
    return str?.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
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
    if (item.pageName === 'exit' || item.pageName === 'helpdesk' || item.pageName === 'suspiciousTransactions' || item.pageName === 'merchantApplication') return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const isActive = location.pathname === toKebabCase(item.pageUrl);

    return (
      <div className='menu-item' key={item.id}>
        <Nav.Link
          onClick={() => handleMenuClick(item)}
          className={`menu-button${isActive ? ' menuActive' : ''}`}
          >
          <div>
            {item.pageIcon && (
              <i className={`${item.pageIcon} menu-icon`} />
            )}
            <span>{t(`menu.${item.pageName}`)}</span>
            {/*<span>{toKebabCase(item.pageUrl)}</span>*/}
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

  const sidebarToggle = () => {
    dispatch(toggleSidebar(!toggleSidebarStatus));
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`sidebar${toggleSidebarStatus ? ' sidebar-actived' : ''}`}>
      <div className='wrapper'>
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
            {/**/}
            <div className='menu-item'>
              <Link onClick={handleLogout} className={`menu-button`}>
                <div>
                  <i className='bx bx-window-close menu-icon'></i>
                  <span>{t('menu.exit')}</span>
                </div>
              </Link>
            </div>
            <div className='menu-item'>
              <Link to={"mailto:info@morpara.com"} className={`menu-button`}>
                <div>
                  <i className='bx bxs-help-circle menu-icon'></i>
                  <span>{t('menu.helpdesk')}</span>
                </div>
              </Link>
            </div> 
          </Nav>
        </div>
        {/* <div className="sidebar-bottom">
          <div className="sidebar-support-box">
            <div className="support-icon">
              <img src={supportIcon} alt="" />
            </div>
            <div className='support-title' dangerouslySetInnerHTML={{ __html: t("menu.supportBoxTitle") }} />
            <div className="support-text">{t('menu.supportBoxText')}</div>
            <Link to={'/'} className="support-button">{t('menu.supportBoxButton')}</Link>
          </div>
        </div> */}
      </div>
      <div className="sidebar-toggle-menu d-xl-none" onClick={sidebarToggle}>
        <i className="pi pi-times"></i>
      </div>
    </div>
  );
};

export default Sidebar; 