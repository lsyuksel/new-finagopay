import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLinkPaymentList, setLinkPaymentListError } from "../../../store/slices/linkPayment/linkPaymentListSlice";

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
    <div>
      <div>LinkPaymentList</div>
    </div>
  );
}
