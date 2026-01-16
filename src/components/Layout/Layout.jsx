import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import TopHeader from "./TopHeader";
import BottomFooter from "./BottomFooter";
import { Outlet, useLocation } from "react-router-dom";

import MemberMerchantLayout from "../../pages/MemberMerchantApplication/MemberMerchantLayout";

const Layout = () => {
  const authData = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  useEffect(() => {
    console.log("authData", authData);
    console.log("pathname", pathname);
  }, [authData]);

  const getMainContentClass = () => {
    if (
      pathname === "/link-payment-list" ||
      pathname.startsWith("/create-link-payment") ||
      pathname.startsWith("/detail-payment/")
    ) {
      return "main-content gray-bg";
    }
    return "main-content";
  };

  return (
    <>
      {authData && authData.isAuthenticated && authData?.user?.onBoardingStatus != 'Basvuru Onay' ? (
        <MemberMerchantLayout />
      ) : (
        <div className="layout">
          <Sidebar />
          <main>
            <TopHeader />
            <div className={getMainContentClass()}>
              <Outlet />
            </div>
            <BottomFooter />
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;
