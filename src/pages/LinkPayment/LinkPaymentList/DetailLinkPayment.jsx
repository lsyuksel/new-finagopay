import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import linkPaymentIcon from "@/assets/images/icons/link-payment-icon.svg";
import { getLinkPayment, setLinkPaymentError } from "../../../store/slices/linkPayment/linkPaymentSlice";

export default function DetailLinkPayment() {
  const { param } = useParams();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, payment } = useSelector(
    (state) => state.linkPayment
  );

  useEffect(() => {
    //dispatch(setLinkPaymentError(null));
    //dispatch(getLinkPayment(param));
  }, []);

  useEffect(() => {
    //console.log("payment", payment);
  }, [payment]);

  return (
    <div>
      <div className="payment-page-info-box">
        <i><img src={linkPaymentIcon} alt="" /></i>
        <div>
          <div className="title">{t('linkPayment.paymentDetailTitle')}</div>
          <div className="text">{t('linkPayment.paymentDetailText')}</div>
        </div>
      </div>
      <h1>Detail Payment :</h1>
      <p>Parametre: {param}</p>
      { param ? (<b>"Detay Link sayfası"</b>) : <b>"Yeni Link sayfası"</b>}
    </div>
  );
}
