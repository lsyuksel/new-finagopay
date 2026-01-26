import React, { useEffect, useState, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import { InputMask } from "primereact/inputmask";

import "react-phone-input-2/lib/bootstrap.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";

import LoginHeader from "@/pages/Login/components/header";
import LoginFooter from "@/pages/Login/components/footer";
import { Accordion, AccordionTab } from 'primereact/accordion';
import logo from '@assets/images/MorPosLogo.png'
import { getUserAgreementByCreateAcount } from "@/store/slices/login/registerSlice";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import { getErrorMessage } from "@/utils/helpers";
import { Message } from "primereact/message";
import errorIcon from "@/assets/images/alerts/error.svg";
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";

import { getHostedPayment, setHostedPaymentError, clearInstallmentList, clearHostedPaymentResult, getInstallments, hostedPageDoPayment } from "@/store/slices/hostedPayment/hostedPaymentSlice";

import { toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import PayLinkResult from "../LinkPayment/Paylink/PayLinkResult";

export default function HostedPaymentPage() {
  const params = useParams();
  const param = params?.param ?? params?.["*"] ?? "";

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, hostedPayment, installmentList, hostedPaymentResult } = useSelector(
    (state) => state.hostedPayment
  );

  useEffect(() => {
    dispatch(clearHostedPaymentResult(null))
    dispatch(setHostedPaymentError(null));
    dispatch(getHostedPayment({uniqueId: param}));
  }, []); 

  const validationSchema = useMemo(() => {
    const schemaShape = {};
    // Kart bilgileri her zaman zorunlu
    schemaShape.cardHolder = Yup.string()
      .required(t("errors.required"))
      .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, t("errors.onlyLetters"))
      .min(3, t("errors.minLength", { length: 3 }))
      .max(50, t("errors.maxLength", { length: 50 }));
    schemaShape.cardNumber = Yup.string()
      .required(t("errors.required"))
      .matches(/^[0-9]+$/, t("errors.onlyNumbers"))
      .min(16, t("errors.minLength", { length: 16 }))
      .max(19, t("errors.maxLength", { length: 19 }))
      .test('luhn', t("errors.invalidCardNumber"), value => {
        if (!value) return false;
        let sum = 0;
        let isEven = false;
        for (let i = value.length - 1; i >= 0; i--) {
          let digit = parseInt(value.charAt(i));
          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }
          sum += digit;
          isEven = !isEven;
        }
        return sum % 10 === 0;
      });
    schemaShape.expireDate = Yup.string()
      .required(t("errors.required"))
      .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, t("errors.invalidExpireDate"));
    schemaShape.cvv = Yup.string()
      .required(t("errors.required"))
      .matches(/^[0-9]+$/, t("errors.onlyNumbers"))
      .min(3, t("errors.minLength", { length: 3 }))
      .max(4, t("errors.maxLength", { length: 4 }));

    return Yup.object().shape(schemaShape);
  }, [t]);

  const formik = useFormik({
    initialValues: {
      cardHolder: "",
      cardNumber: "",
      expireDate: "",
      cvv: "",
      saleIs3d: false,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {

      // paymentPageTransaction içindeki orderId kontrolü: null ise "", değilse geçerli değer
      const paymentPageTransaction = hostedPayment ? {
        ...hostedPayment,
        orderId: hostedPayment.orderId == null ? "" : hostedPayment.orderId
      } : {};

      const formattedValues = {
        ...values,
        expireDate: values.expireDate.replace(/\//g, ''),

        installmentCount: 0,
        updateDateTime: new Date().toISOString(),

        paymentPageTransaction,
      };

      console.log("hostedPageDoPayment formattedValues",formattedValues);

      dispatch(hostedPageDoPayment(formattedValues))
        .unwrap()
        .then(() => {
          //toast.success(t("messages.success"));
        })
        .catch((error) => {
          dispatch(setHostedPaymentError(error));
          toast.error(error);
        });
    },
  });

  const handleCardNumberChange = async (e) => {
    const value = e.target.value.replace(/\s/g, '');
    formik.setFieldValue('cardNumber', e.target.value);

    if (value.length > 5) {
      if(installmentList === null) {
        try {
          dispatch(getInstallments({
            bin: String(parseInt(value)).slice(0,6),
            merchantId: hostedPayment?.merchantId,
            language: i18n.language.slice(0,2),
          })).unwrap();
        } catch (error) {
          console.error('Taksit seçenekleri alınamadı:', error);
        }
      }
    } else {
      dispatch(clearInstallmentList());
    }
  };

  useEffect(() => {
    console.log("hostedPayment",hostedPayment);
  }, [hostedPayment])
  
  
  useEffect(() => {
    console.log("hostedPaymentResult",hostedPaymentResult);
    
    // hostedPaymentResult içinde okUrl veya failUrl varsa yönlendirme yap
    if (hostedPaymentResult) {
      if (hostedPaymentResult.okUrl) {
        window.location.href = hostedPaymentResult.okUrl;
      } else if (hostedPaymentResult.failUrl) {
        window.location.href = hostedPaymentResult.failUrl;
      }
    }
  }, [hostedPaymentResult])
  
  // if(hostedPaymentResult) return <PayLinkResult />
  if(loading) return <ProgressSpinner className="custom-page-proggress" />

  return (
    <div className="paylink-container">
      <LoginHeader />
      <div className="paylink-content">
        <div className="container">
          <div className="row align-items-strech h-100">
            <div className="col-12 right-column">
              <div className="hosted-payment-form">
                <div className="auth-form-area">
                  <Form onSubmit={formik.handleSubmit}>
                    {error && (
                      <Message
                        severity="error"
                        className="d-flex justify-content-start gap-1 mb-4"
                        content={
                          <>
                            <img src={errorIcon} />
                            <div>
                              <b>{t("common.error")}: </b>
                              {error}
                            </div>
                          </>
                        }
                      />
                    )}
                    {getErrorMessage(formik)
                      ? (() => {
                          const errorMessage = getErrorMessage(formik);
                          return errorMessage ? (
                            <Message
                              severity="error"
                              className="d-flex justify-content-start gap-1 mb-4"
                              content={
                                <>
                                  <img src={errorIcon} />
                                  <div>
                                    <b>{t("common.error")}: </b>
                                    {errorMessage}
                                  </div>
                                </>
                              }
                            />
                          ) : null;
                        })()
                      : null}
                      <Accordion activeIndex={0}>
                        <AccordionTab header={t('linkPayment.payLinkTitle3')}
                          className={ (formik.errors.nameSurname || formik.errors.email || formik.errors.phoneNumber ) ? "error-accordion" : "success-accordion" }>

                          <Form.Group className="form-item flex-row gap-4">
                            <Form.Control
                              placeholder={t("common.cardHolder")}
                              type="text"
                              id="cardHolder"
                              name="cardHolder"
                              value={formik.values.cardHolder}
                              onChange={formik.handleChange}
                              isInvalid={formik.touched.cardHolder && formik.errors.cardHolder}
                              disabled={loading}
                            />
                          </Form.Group>
                          <Form.Group className="form-item flex-row gap-4">
                            <InputMask
                              placeholder={t("common.cardNumber")}
                              mask="9999 9999 9999 9999"
                              id="cardNumber"
                              name="cardNumber"
                              value={formik.values.cardNumber}
                              onChange={handleCardNumberChange}
                              invalid={formik.touched.cardNumber && formik.errors.cardNumber}
                              disabled={loading}
                              className="p-form-control"
                              autoClear={false}
                              unmask={true}
                            />
                          </Form.Group>
                          <Form.Group className="form-item flex-row gap-4">
                            <InputMask
                              placeholder={t("common.expireDate")}
                              mask="99/99"
                              id="expireDate"
                              name="expireDate"
                              className="p-form-control"
                              value={formik.values.expireDate}
                              onChange={formik.handleChange}
                              invalid={formik.touched.expireDate && formik.errors.expireDate}
                              disabled={loading}
                              unmask={false}
                            />
                            <Form.Control
                              placeholder={t("common.cvv")}
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formik.values.cvv}
                              onChange={formik.handleChange}
                              isInvalid={formik.touched.cvv && formik.errors.cvv}
                              disabled={loading}
                            />
                          </Form.Group>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <InputSwitch
                              inputId="saleIs3d"
                              name="saleIs3d"
                              checked={formik.values.saleIs3d === true}
                              onChange={(e) => {
                                formik.setFieldValue("saleIs3d", e.value ? true : false);
                              }}
                              disabled={loading}
                            />
                            <label htmlFor="saleIs3d" className="switch-link">
                              3D Secure ile Öde
                            </label>
                          </div>
                          {
                            installmentList && installmentList?.responseCode === "B0000" && (
                              <>
                                <div className="installment-title">Taksit Seçenekleri</div>
                                <div className="installment-list">
                                  {installmentList?.installmentList && Array.isArray(installmentList.installmentList) && installmentList.installmentList.length > 0 ? (
                                    installmentList.installmentList.map((item, index) => (
                                      <div className="item" key={index}>
                                        <RadioButton 
                                          inputId={item.installmentId || `installment_${index}`}
                                          name="installmentId"
                                          value={item.installmentId || index}
                                          checked={true}
                                        />
                                        <label htmlFor={item.installmentId || `installment_${index}`} className="ml-2">
                                          {item.installmentCount ? `${item.installmentCount} ${t('linkPayment.installment')}` : t('linkPayment.singlePayment')}
                                        </label>
                                        <div className="price">
                                          {item.installmentTotalAmount || hostedPayment?.amount} {hostedPayment?.currencyAlphaCode || installmentList?.cardBrand}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="item">
                                      <RadioButton 
                                        inputId="single_payment"
                                        name="installmentId"
                                        value="1"
                                        checked={true}
                                      />
                                      <label htmlFor="single_payment" className="ml-2">{t('linkPayment.singlePayment')}</label>
                                      <div className="price">{hostedPayment?.amount} {hostedPayment?.currencyAlphaCode}</div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )
                          }
                        </AccordionTab>
                      </Accordion>
                      <div className="link-preview-modal-bottom py-5">
                        <div className="logo">
                          <img src={logo} alt="" height={'30px'} />
                          <span>{t('linkPayment.logoText')}</span>
                        </div>
                        <div className="payment-button">
                          <button className="complete-payment-button">
                            <span>{t("linkPayment.completePayment")}</span>
                            <div className="price">{hostedPayment?.amount} {hostedPayment?.currencyAlphaCode}</div>
                          </button>
                        </div>
                      </div>
                  </Form>
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
  );
}