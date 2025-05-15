import React, { useEffect } from 'react'

import LoginHeader from "@/pages/Login/components/header";
import LoginFooter from "@/pages/Login/components/footer";
import { Link, useParams } from 'react-router-dom';
import successIcon from "@/assets/images/alerts/success.svg";
import errorIcon from "@/assets/images/alerts/error2.svg";

import { t } from 'i18next';
import { useSelector } from 'react-redux';

export default function PayLinkResult() {
    const { param } = useParams();

    const { loading, error, success, payment, installmentList, payLinkResult } = useSelector(
      (state) => state.linkPayment
    );
        
    useEffect(() => {
      console.log("payLinkResult",payLinkResult);
    }, []);

    return (
        <div className="auth-container paylink-page">
            <LoginHeader pageTitle={t("Penta Yazılım A.Ş")} />
            <div className="auth-content">
                <div className="container">
                <div className="row align-items-strech">
                    <div className="col-12">
                        {payLinkResult?.resultDescription === "Approved" ? (
                            <div className='result-box success'>
                                <div className="icon"><img src={successIcon} /></div>
                                <div className="title">{t("linkPayment.successTitle")}</div>
                                <div className="price">{payment?.u} {payment?.y}</div>
                                <div className="subtitle">{t("linkPayment.orderNumber")}: <b>{payLinkResult?.orderId}</b></div>
                                <div className="product-info-sum">
                                    <table>
                                        <tr>
                                            <td>{t('linkPayment.productName')}:</td>
                                            <td>{payment?.c}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('linkPayment.quantity')}:</td>
                                            <td>99 Adet</td>
                                        </tr>
                                        <tr>
                                            <td>{t('linkPayment.storeName')}:</td>
                                            <td>Penta Yazılım A.Ş</td>
                                        </tr>
                                        <tr>
                                            <td>{t('linkPayment.installmentCount')}:</td>
                                            <td>3 Taksit x 21.300 TL</td>
                                        </tr>
                                    </table>
                                </div>
                                <Link to={"/"} className="result-button mx-auto">
                                    {t("linkPayment.returnHome")}
                                </Link>
                            </div>
                        ) : (
                            <div className='result-box error'>
                                <div className="icon"><img src={errorIcon} /></div>
                                <div className="title">{t("linkPayment.errorTitle")}</div>
                                <div className="error-code">{payLinkResult?.resultDescription}</div>
                                <div className="subtitle">{t("linkPayment.errorCode")}: <b>{payLinkResult?.resultCode}</b></div>
                                <div className="text">{t("linkPayment.retryText")}</div>
                                <a href={`/linkpayment/${param}`} className="result-button mx-auto">
                                    {t("linkPayment.retryButton")}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
            <div className="footer-bottom">
                <LoginFooter
                    className="login-footer-container"
                    text={t("login.footerText")}
                />
            </div>
        </div>
    )
}
