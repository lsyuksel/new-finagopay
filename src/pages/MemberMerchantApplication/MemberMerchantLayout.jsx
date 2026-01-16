import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import LoginHeader from "../Login/components/header";
import LoginFooter from "../Login/components/footer";
import AuthBanner from "../Login/components/AuthBanner";
import MemberMerchantApplication from "./MemberMerchantApplication";
import SuccessStatus from "./components/SuccessStatus";
import WarningStatus from "./components/WarningStatus";
import ContractApproval from "./components/ContractApproval";
import { fetchMenuItems } from "../../store/slices/menuSlice";

export default function MemberMerchantLayout() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const authData = useSelector((state) => state.auth);

    const authText = [t('login.bannerListItem1'), t('login.bannerListItem2'), t('login.bannerListItem3')]

    useEffect(() => {
        dispatch(fetchMenuItems());
    }, []);

    const renderContent = () => {
        if (!authData?.user) {
            return null;
        }

        const { isBoarding, onBoardingStatus, onBoardingSubStatus } = authData.user;
        // Başvuru formu gösterilecek durum
        if (isBoarding === false) {
            return (
                <>
                    <div className="col-md-6 order-md-1 order-2">
                        <AuthBanner
                            title={t('login.bannerTitle')}
                            subtitle={t('login.bannerSubTitle')}
                            authText={authText}
                        />
                    </div>
                    <div className="col-md-6 order-md-2 order-1 mb-4 mb-md-0">
                        <div className="auth-form-area">
                            <MemberMerchantApplication />
                        </div>
                    </div>
                </>
            );
        }

        // Başvuru durum mesajları
        switch (onBoardingStatus) {
            case 'Basvuru Degerlendirme':
                switch (onBoardingSubStatus) {
                    case 'Basvuru Iletildi':
                        return <SuccessStatus onBoardingSubStatus={onBoardingSubStatus} />;

                    case 'Basvuru Sözlesme Onayinda':
                        return <ContractApproval onBoardingSubStatus={onBoardingSubStatus} />;

                    default:
                        return <WarningStatus onBoardingStatus={onBoardingStatus} onBoardingSubStatus={onBoardingSubStatus} />;
                }
            
            default:
                return <WarningStatus onBoardingStatus={onBoardingStatus} onBoardingSubStatus={onBoardingSubStatus} />;
        }
    };

    return (
        <div className="auth-container">
            <LoginHeader pageTitle={t("login.authHeaderTitlepassword")} />
            <div className="auth-content merchant-page-content">
                <div className="container">
                    <div className="row align-items-strech">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <LoginFooter className="login-footer-container" text={t("login.footerText")} />
        </div>
    );
}
