import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-bootstrap";

import demoProfilePicture from '@assets/images/demoProfilePicture.png';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/slices/login/authSlice";

export default function AccountDropdown() {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const accountLinks = [
    // { link: "/accounts", name: t("menu.account"), icon: "pi-user" },
    { link: "/user-definition", name: t("menu.profileSettings"), icon: "pi-cog" },
    { link: "/key-definition", name: t("menu.companySettings"), icon: "pi-pen-to-square" },
    { link: "/logout", name: t("menu.exit"), icon: "pi-sign-out" },
  ];

  const navigateFunction = (item) => {
    if(item == '/logout') {
      dispatch(logoutUser());
      // navigate authService.logout içinde yapılıyor
    } else {
      navigate(item)
      console.log("item",item)
    }
  };

  return (
    <div className="account-menu">
      <Dropdown
        className="account-menu-selector"
        show={isOpen}
        onToggle={(isOpen) => setIsOpen(isOpen)}
      >
        <Dropdown.Toggle>
          <div>
            {/* <i>
              <img src={demoProfilePicture} />
            </i> */}
            <div>
              <b>{user.firstName} {user.lastName}</b>
              <span>{user.guid}</span>
            </div>
          </div>
          <i className="pi pi-chevron-circle-down"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {accountLinks.map((item,index) => (
            <Dropdown.Item onClick={()=>navigateFunction(item.link)} key={index}>
              <i className={'pi '+item.icon}></i>
              <span>{item.name}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
