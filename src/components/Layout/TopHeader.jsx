import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LanguageSelector from "../Common/LanguageSelector";
import { fetchMenuItems, toggleSidebar } from "../../store/slices/menuSlice";
import { useTranslation } from "react-i18next";
import { InputText } from "primereact/inputtext";
import smallLogo from '@assets/images/small-logo.png'
import { Link } from "react-router-dom";
import { ScrollPanel } from 'primereact/scrollpanel';
import { useLocation } from 'react-router-dom';
import AccountDropdown from "../Common/AccountDropdown";

export default function TopHeader() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { toggleSidebarStatus, items } = useSelector((state) => state.menu);

  useEffect(() => {
    setSearchValue("")
  }, [])
  
  useEffect(() => {
    setSearchValue("");
    setSearchResults([]);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return null;
  }  

  const sidebarToggle = () => {
    dispatch(toggleSidebar(!toggleSidebarStatus));
  }

  const toKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  };
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {

      let searchResults = [];
      items.forEach(item => {
        item.children && item.children.forEach((menu)=> {
          searchResults.push({pageUrl: toKebabCase(menu.pageUrl),pageName: t(`menu.${menu.pageName?.toLowerCase()}`, menu.pageName)})
        })
      });

      searchResults = searchResults.filter(item => item.pageName.toLowerCase().includes(value.toLowerCase()));
      console.log("searchResults",searchResults);

      setSearchResults(searchResults);

    } else {
      setSearchResults([]);
    }
  };
  return (
    <div className="top-header">
        <div className="row align-items-center">
            <div className="col-lg">
                <div className="header-wrapper">
                    <div className="sidebar-toggle-menu" onClick={sidebarToggle}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7Z" fill="#8200BA"/>
                        <path d="M3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12Z" fill="#8200BA"/>
                        <path d="M4 16C3.44772 16 3 16.4477 3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17C21 16.4477 20.5523 16 20 16H4Z" fill="#8200BA"/>
                      </svg>
                    </div>
                    <div className="search-content">
                        <i className="search-icon"><img src={smallLogo} /></i>
                        <InputText 
                          value={searchValue}
                          onChange={handleSearch}
                          placeholder={t('common.searchInput')}
                          type="text"
                          className="search-input"
                        />
                        <button className="search-button">
                          <i className="pi pi-search"></i>
                        </button>
                          {searchResults.length > 0 && (
                          <div className="search-results">
                            <div className="wrapper">
                              {searchResults.map((menu, index) => (
                                <div key={index} className="search-result-item">
                                  <Link to={menu.pageUrl}>{menu.pageName}</Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-lg-auto">
                <div className="header-right-buttons">
                    <LanguageSelector />
                    <AccountDropdown />
                </div>
            </div>
        </div>
    </div>
  )
}
