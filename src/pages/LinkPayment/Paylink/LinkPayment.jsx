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
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from "primereact/radiobutton";
import { clearInstallmentList, clearPayLinkResult, getInstallments, payLink } from "../../../store/slices/linkPayment/linkPaymentSlice";
import { toast } from "react-toastify";
import PayLinkResult from "./PayLinkResult";
import { ProgressSpinner } from "primereact/progressspinner";

export default function LinkPayment() {
  const { testOptions } = useSelector((state) => state.selectOptions);
  const { param } = useParams();
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userAgreement } = useSelector(
    (state) => state.register);

  const { loading, error, success, payment, installmentList, payLinkResult } = useSelector(
    (state) => state.linkPayment
  );

  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [visibleDialogs, setVisibleDialogs] = useState({});

  useEffect(() => {
    dispatch(clearPayLinkResult(null))
    dispatch(setLinkPaymentError(null));
    dispatch(getLinkPayment(param));
    dispatch(getUserAgreementByCreateAcount());
  }, []);

  // Dinamik validation schema - payment?.e ve payment?.f değerlerine göre
  const validationSchema = useMemo(() => {
    const schemaShape = {};

    // Kişisel bilgiler validasyonu - sadece payment?.f true ise
    if (payment?.f) {
      schemaShape.nameSurname = Yup.string().required(t("errors.required"));
      schemaShape.phoneNumber = Yup.string()
        .required(t("errors.required"))
        .test("not-start-with-zero", t("errors.phoneStartsWithZero"), (value) =>
          value ? !value.startsWith("0") : true
        );
      schemaShape.email = Yup.string()
        .email(t("errors.invalidEmail"))
        .required(t("errors.required"));
    }

    // Adres bilgileri validasyonu - sadece payment?.e true ise
    if (payment?.e) {
      schemaShape.country = Yup.string().required(t("errors.required"));
      schemaShape.city = Yup.string().required(t("errors.required"));
      schemaShape.province = Yup.string().required(t("errors.required"));
      schemaShape.district = Yup.string().required(t("errors.required"));
      schemaShape.neighborhood = Yup.string().required(t("errors.required"));
      schemaShape.postalCode = Yup.string().required(t("errors.required"));
      schemaShape.address = Yup.string().required(t("errors.required"));
    }

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

    // Sözleşme onayı
    schemaShape.agreements = Yup.array().test(
      "all-agreements",
      t("errors.required"),
      function (value) {
        return selectedAgreements?.length === userAgreement?.length;
      }
    );

    return Yup.object().shape(schemaShape);
  }, [payment?.f, payment?.e, selectedAgreements, userAgreement, t]);

  const formik = useFormik({
    initialValues: {
      nameSurname: "",
      email: "",
      phoneNumber: "",
      phoneCode: "90",
      
      country: "",
      city: "",
      province: "",
      district: "",
      neighborhood: "",
      postalCode: "",
      address: "",
      
      cardHolder: "",
      cardNumber: "",
      expireDate: "",
      cvv: "",

      linkKey: param,
      agreements: [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      // merchantInfo'yu koşullu olarak hazırla
      const merchantInfo = {};
      
      // payment?.f true ise kişisel bilgileri ekle
      if (payment?.f) {
        merchantInfo.nameSurname = values.nameSurname;
        merchantInfo.phoneNumber = values.phoneCode + values.phoneNumber;
        merchantInfo.email = values.email;
      }
      
      // payment?.e true ise adres bilgisini ekle
      if (payment?.e) {
        merchantInfo.address = values.address;
      }

      const formattedValues = {
        ...values,
        agreements: selectedAgreements,
        expireDate: values.expireDate.replace(/\//g, ''),
        // merchantInfo sadece içinde veri varsa ekle
        ...(Object.keys(merchantInfo).length > 0 && { merchantInfo })
      };
      dispatch(payLink(formattedValues))
        .unwrap()
        .then(() => {
          //toast.success(t("messages.success"));
        })
        .catch((error) => {
          dispatch(setLinkPaymentError(error));
          toast.error(error);
        });
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

  const handleCardNumberChange = async (e) => {
    const value = e.target.value.replace(/\s/g, '');
    formik.setFieldValue('cardNumber', e.target.value);

    if (value.length > 5) {
      if(installmentList === null) {
        try {
          dispatch(getInstallments({
            bin: String(parseInt(value)).slice(0,6),
            merchantId: payment?.t,
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
  
  if(payLinkResult) return <PayLinkResult />
  if(loading) return <ProgressSpinner className="custom-page-proggress" />

  return (
    <div className="paylink-container">
      <LoginHeader pageTitle={t("Firma Adı A.Ş")} />
      <div className="paylink-content">
        <div className="container">
          <div className="row align-items-strech h-100">
            <div className="col-lg-5 left-column">
              <div>
                { payment && (
                  <ProductCard
                    productImage={payment?.l}
                    title={payment?.c}
// description={'EKLENECEK'}
                    price={payment?.u}
                    priceCurrency={payment?.y}
                  />
                )}
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
                      {payment?.f && (
                        <AccordionTab header={t('linkPayment.payLinkTitle1')}
                          className={ (formik.errors.nameSurname || formik.errors.email || formik.errors.phoneNumber ) ? "error-accordion" : "success-accordion" }>
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
                      )}
                      {payment?.e && (
                        <AccordionTab header={t('linkPayment.payLinkTitle2')}
                          className={ 
                            (formik.errors.country || formik.errors.city || formik.errors.province ||
                              formik.errors.district || formik.errors.neighborhood || formik.errors.postalCode ||
                              formik.errors.address
                            ) ? "error-accordion" : "success-accordion"
                            }>
                          <Form.Group className="form-item flex-row gap-4">
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="country"
                                name="country"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                invalid={formik.touched.country && formik.errors.country}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.Country")}
                                filter
                              />
                            )}
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="city"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                invalid={formik.touched.city && formik.errors.city}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.City")}
                                filter
                              />
                            )}
                          </Form.Group><Form.Group className="form-item flex-row gap-4">
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="province"
                                name="province"
                                value={formik.values.province}
                                onChange={formik.handleChange}
                                invalid={formik.touched.province && formik.errors.province}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.Province")}
                                filter
                              />
                            )}
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="district"
                                name="district"
                                value={formik.values.district}
                                onChange={formik.handleChange}
                                invalid={formik.touched.district && formik.errors.district}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.District")}
                                filter
                              />
                            )}
                          </Form.Group><Form.Group className="form-item flex-row gap-4">
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="neighborhood"
                                name="neighborhood"
                                value={formik.values.neighborhood}
                                onChange={formik.handleChange}
                                invalid={formik.touched.neighborhood && formik.errors.neighborhood}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.Neighborhood")}
                                filter
                              />
                            )}
                            {testOptions?.length > 0 && (
                              <Dropdown
                                id="postalCode"
                                name="postalCode"
                                value={formik.values.postalCode}
                                onChange={formik.handleChange}
                                invalid={formik.touched.postalCode && formik.errors.postalCode}
                                disabled={loading}
                                options={testOptions}
                                optionLabel="label"
                                optionValue="guid"
                                className="p-form-control"
                                placeholder={t("common.PostalCode")}
                                filter
                              />
                            )}
                          </Form.Group>
                          <Form.Group className="form-item flex-row gap-4">
                            <Form.Control
                              placeholder={t("common.ContinueAddress")}
                              type="text"
                              id="address"
                              name="address"
                              value={formik.values.address}
                              onChange={formik.handleChange}
                              isInvalid={formik.touched.address && formik.errors.address}
                              disabled={loading}
                            />
                          </Form.Group>
                        </AccordionTab>
                      )}
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
                                        {item.installmentTotalAmount || payment?.u} {payment?.y || installmentList?.cardBrand}
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
                                    <div className="price">{payment?.u} {payment?.y}</div>
                                  </div>
                                )}
                              </div>
                            </>
                          )
                        }
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