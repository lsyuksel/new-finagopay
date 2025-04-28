import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { InputMask } from "primereact/inputmask";

import "react-phone-input-2/lib/bootstrap.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";

import { getLinkPayment, setLinkPaymentError } from "@/store/slices/linkPayment/linkPaymentSlice";
import LoginHeader from "@/pages/Login/components/header";
import LoginFooter from "@/pages/Login/components/footer";
import ProductCard from "./ProductCard";
import { Accordion, AccordionTab } from 'primereact/accordion';
import logo from '@assets/images/MorPosLogo.png'
import { getUserAgreementByCreateAcount } from "../../../store/slices/login/registerSlice";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import { getErrorMessage } from "../../../utils/helpers";
import { Message } from "primereact/message";
import errorIcon from "@/assets/images/alerts/error.svg";

export default function LinkPayment() {
  const { param } = useParams();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userAgreement } = useSelector(
    (state) => state.register);

  const { loading, error, success, payment } = useSelector(
    (state) => state.linkPayment
  );
  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [visibleDialogs, setVisibleDialogs] = useState({});

  useEffect(() => {
    dispatch(setLinkPaymentError(null));
    dispatch(getLinkPayment(param));
    dispatch(getUserAgreementByCreateAcount());
  }, []);

  useEffect(() => {
    console.log("payment", payment);
  }, [payment]);

  const validationSchema = Yup.object().shape({
    nameSurname: Yup.string().required(t("errors.required")),
    phoneNumber: Yup.string()
      .required(t("errors.required"))
      .test("not-start-with-zero", t("errors.phoneStartsWithZero"), (value) =>
        value ? !value.startsWith("0") : true
      ),
    email: Yup.string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.required")),
    agreements: Yup.array().test(
      "all-agreements",
      t("errors.required"),
      function (value) {
        return selectedAgreements.length === userAgreement.length;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      merchantInfo: {
      },
      nameSurname: "",
      email: "",
      phoneNumber: null,
      phoneCode: "90",
      address: "",
      agreements: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("values",values)
      /*
      values.agreements = selectedAgreements;
      dispatch(registerUser(values))
        .unwrap()
        .then(() => {
          toast.success(t("messages.registerSuccess"));
        })
        .catch((error) => {
          dispatch(setRegisterError(error));
          toast.error(error);
        });
        */
    },
  });

  const handleAgreementChange = (value, guid) => {
    const newSelectedAgreements = value
      ? [...selectedAgreements, { guid: guid }]
      : selectedAgreements.filter((agreement) => agreement.guid !== guid);
    setSelectedAgreements(newSelectedAgreements);
    formik.setFieldValue(
      "agreements",
      value
        ? [...formik.values.agreements, guid]
        : formik.values.agreements.filter((guid) => guid !== guid)
    );
  };

  const renderAgreementText = (item) => {
    const parts = item.description.split(item.linkedText);
    return (
      <>
        {parts[0]}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setVisibleDialogs((prev) => ({
              ...prev,
              [item.guid]: true,
            }));
          }}
          className="text-link"
        >
          {item.linkedText}
        </a>

        <Dialog
          header={item.name}
          visible={visibleDialogs[item.guid]}
          style={{ width: "70vw" }}
          onHide={() => {
            if (!visibleDialogs[item.guid]) return;
            setVisibleDialogs((prev) => ({
              ...prev,
              [item.guid]: false,
            }));
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: item.agreementContent }} />
        </Dialog>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="paylink-container">
      <LoginHeader pageTitle={t("Penta Yazılım A.Ş")} />
      <div className="paylink-content">
        <div className="container">
          <div className="row align-items-strech h-100">
            <div className="col-lg-5 left-column">
              <div>
                <ProductCard
                  productImage={payment?.l}
                  title={payment?.c}
                  description={'EKLENECEK'}
                  price={payment?.u}
                  priceCurrency={payment?.y}
                />
              </div>
            </div>
            <div className="col-lg-7 right-column">
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
                        <AccordionTab header={t('linkPayment.payLinkTitle1')}>
                          <Form.Group className="form-item">
                            <Form.Control
                              placeholder={t("common.firstLastName")}
                              type="text"
                              id="nameSurname"
                              name="nameSurname"
                              value={formik.values.nameSurname}
                              onChange={formik.handleChange}
                              isInvalid={formik.touched.nameSurname && formik.errors.nameSurname}
                              disabled={loading}
                            />
                          </Form.Group>
                          <Form.Group className="form-item">
                            <Form.Control
                              placeholder={t("common.email")}
                              type="email"
                              id="email"
                              name="email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              isInvalid={formik.touched.email && formik.errors.email}
                              disabled={loading}
                            />
                          </Form.Group>
                          <Form.Group className="form-item">
                            <div className="phone-input-container">
                              <PhoneInput
                                inputProps={{
                                  disabled: true,
                                }}
                                country={"tr"}
                                id="phoneCode"
                                value={formik.values.phoneCode}
                                onChange={(phone) => (formik.values.phoneCode = phone)}
                              />
                              <InputMask
                                className="p-form-control"
                                mask="999 999 99 99"
                                placeholder="999 999 99 99"
                                id="phoneNumber"
                                invalid={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                disabled={loading}
                              ></InputMask>
                            </div>
                          </Form.Group>
                        </AccordionTab>
                        <AccordionTab header={t('linkPayment.payLinkTitle2')}>
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab header={t('linkPayment.payLinkTitle3')}>
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                    </Accordion>
                    {userAgreement?.map((item, index) => (
                      <div className="d-flex align-items-center gap-2 mb-3" key={index}>
                        <InputSwitch
                          inputId={`agreement_${item.guid}`}
                          name={`agreement_${item.guid}`}
                          checked={selectedAgreements.some(
                            (agreement) => agreement.guid === item.guid
                          )}
                          onChange={(e) => {
                            handleAgreementChange(e.value, item.guid);
                            formik.setFieldValue(
                              "agreements",
                              e.value
                                ? [...formik.values.agreements, item.guid]
                                : formik.values.agreements.filter(
                                    (guid) => guid !== item.guid
                                  )
                            );
                          }}
                          className={classNames({ "p-invalid": formik.errors.agreements })}
                        />
                        <label htmlFor={`agreement_${item.guid}`} className="switch-link">
                          {renderAgreementText(item)}
                        </label>
                      </div>
                    ))}
                    <div className="link-preview-modal-bottom py-5">
                      <div className="logo">
                        <img src={logo} alt="" height={'30px'} />
                        <span>{t('linkPayment.logoText')}</span>
                      </div>
                      <div className="payment-button">
                        <button className="complete-payment-button">
                          <span>{t("linkPayment.completePayment")}</span>
                          <div className="price">{payment?.u} {payment?.y}</div>
                        </button>
                      </div>
                    </div>
                </Form>
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