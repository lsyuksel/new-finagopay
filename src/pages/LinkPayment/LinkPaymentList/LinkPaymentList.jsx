import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getLinkPaymentList, setLinkPaymentListError } from "../../../store/slices/linkPayment/linkPaymentListSlice";

import linkPaymentIcon from "@/assets/images/icons/link-payment-icon.svg";

export default function LinkPaymentList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, success, paymentList } = useSelector((state) => state.linkPaymentList);

  useEffect(() => {
    dispatch(setLinkPaymentListError(null));
    dispatch(getLinkPaymentList(user.userName));
  }, []);

  useEffect(() => {
    console.log("paymentList", [user.userName,paymentList]);
  }, [paymentList]);

  return (
    <>
      <div className="payment-page-info-box">
        <i><img src={linkPaymentIcon} alt="" /></i>
        <div>
          <div className="title">{t('linkPayment.paymentListTitle')}</div>
          <div className="text">{t('linkPayment.paymentListText')}</div>
        </div>
      </div>
      <h1>LinkPaymentList</h1>
      <Link to={'http://localhost:5173/linkpayment/yioWMg'}>Örnek ödeme linki</Link>
    </>
  );
}
