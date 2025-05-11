import React, { useEffect } from 'react'

import LoginHeader from "@/pages/Login/components/header";
import LoginFooter from "@/pages/Login/components/footer";
import { Link } from 'react-router-dom';
import successIcon from "@/assets/images/alerts/success.svg";
import errorIcon from "@/assets/images/alerts/error2.svg";

import { t } from 'i18next';
import { useSelector } from 'react-redux';

export default function PayLinkResult() {
    const { loading, error, success, payment, installmentList, payLinkResult } = useSelector(
      (state) => state.linkPayment
    );
    useEffect(() => {
      console.log("payLinkResult",payLinkResult);
    }, []);

    return (
        <div className="auth-container">
        <LoginHeader pageTitle={t("Penta Yazılım A.Ş")} />
        <div className="auth-content">
            <div className="container">
            <div className="row align-items-strech">
                <div className="col-12">
                <div className="auth-form-area">
                    <div className="forgot-password-container">
                        <div className="process-result-container">
                            <div className="title">{t("Ödeme işlemi Başarısız Oldu!")}</div>
                            <div className="icon">
                                <img src={errorIcon} />
                            </div>
                            <div className="result-text error-color">
                                {payLinkResult?.resultDescription}
                            </div>
                            <div className='text-content' dangerouslySetInnerHTML={{ __html: t("messages.confirmationEmailContent") }} />
                            <Link to={"/login"} className="login-button mx-auto">
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                {t("login.authHeaderTitlelogin")}
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <LoginFooter
            className="login-footer-container"
            text={t("login.footerText")}
        />
        </div>
    )
}
