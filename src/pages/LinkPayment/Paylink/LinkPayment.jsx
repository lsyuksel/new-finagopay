import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getLinkPayment, setLinkPaymentError } from "../../../store/slices/linkPayment/linkPaymentSlice";
import LoginHeader from "@/pages/Login/components/header";
import LoginFooter from "@/pages/Login/components/footer";

export default function LinkPayment() {
  const { param } = useParams();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, payment } = useSelector(
    (state) => state.linkPayment
  );

  useEffect(() => {
    dispatch(setLinkPaymentError(null));
    dispatch(getLinkPayment(param));
  }, []);

  useEffect(() => {
    console.log("payment", payment);
  }, [payment]);

  return (
    <div className="auth-container">
      <LoginHeader pageTitle={t("login.authHeaderTitlepassword")} />
      <div className="auth-content">
        <div className="container">
          <div className="row align-items-strech">
            <div className="col-12">
              <div>
                <h1>LinkPayment</h1>
                <p>Parametre: {param}</p> {/* Parametreyi göster */}
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
  );
}