import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import linkPaymentIcon from "@/assets/images/icons/link-payment-icon.svg";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import errorIcon from "@/assets/images/alerts/error.svg";
import fileUploadIcon from "@/assets/images/icons/fileUploadIcon.svg";
import previewButtonIcon from "@/assets/images/icons/previewButtonIcon.svg";
import installmentTableIcon from "@/assets/images/icons/installmentTableIcon.svg";
import createProductButton from "@/assets/images/icons/createProductButton.svg";
import { Link } from 'react-router-dom'
import logo from '@assets/images/MorPosLogo.png'
import installmentTableImg1 from "@/assets/images/link-payment/installmentTableImg1.png";
import installmentTableImg2 from "@/assets/images/link-payment/installmentTableImg2.png";

import { getErrorMessage } from "@/utils/helpers.jsx";

import { getMerchantLinkPayment, insertMerchantLinkPayment, setLinkPaymentDetailError, updateMerchantLinkPayment } from "../../../store/slices/linkPayment/linkPaymentDetailSlice";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';

import { toast } from "react-toastify";
import { Message } from "primereact/message";
import { getAllProductType, getCurrencyDef } from "../../../store/slices/selectOptionSlice";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from 'primereact/dialog';
import AccordionList from "../../../components/Common/AccordionList";
import ProductCard from "../Paylink/ProductCard";
import { getCurrencyName } from "../../../utils/helpers";
import { ProgressSpinner } from "primereact/progressspinner";

export default function DetailLinkPayment() {
  const [installmentTable, setInstallmentTable] = useState(false);
  const [linkPaymentPreview, setLinkPaymentPreview] = useState(false);
  
  const { param } = useParams();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const authData = useSelector((state) => state.auth);
  const { currencyDef, allProductType } = useSelector((state) => state.selectOptions);
  const { loading, error, success, data } = useSelector((state) => state.linkPaymentDetail);

  const detailLoadData = async () => {
    if (param) {
      formik.setValues({
        guid: data?.guid,
        linkUrlKey: data?.linkUrlKey,
        merchantId: `${authData.merchantId}`,
        productImageBase64: data?.productImageBase64 || "",
        productName: data?.productName || "",
        productDescription: data?.productDescription || "",
        productPrice: data?.productPrice || "",
        currencyGuid: data?.currencyGuid || "240127211946100997",
        stock: data?.stock || 0,
        stockEnabled: data?.stock ? true : false,
        installmentInfoEnabled: data?.installmentInfoEnabled || false,
        merchantAddressEnabled: data?.merchantAddressEnabled || false,
        merchantNameEnabled: data?.merchantNameEnabled || false,
        productTypeGuid: data?.productTypeGuid || 2,
      });
    }
  }
  
  useEffect(() => {
    if(param) dispatch(getMerchantLinkPayment(param));
  }, [])

  useEffect(() => {
    if(currencyDef.length === 0) dispatch(getCurrencyDef());
    if(allProductType.length === 0) dispatch(getAllProductType());
    dispatch(setLinkPaymentDetailError(null));
    detailLoadData();
  }, [data]);
  

  const validationSchema = Yup.object().shape({
    productName: Yup.string().required(t("errors.required")),
    productDescription: Yup.string().required(t("errors.required")),
    productPrice: Yup.string().required(t("errors.required")),
    stock: Yup.string().required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      merchantId: `${authData.merchantId}`,
      productImageBase64: null,
      productName: "",
      productDescription: "",
      productPrice: "",
      currencyGuid: "240127211946100997",
      stock: null,
      stockEnabled: false,
      installmentInfoEnabled: false,
      merchantAddressEnabled: false,
      merchantNameEnabled: false,
      productTypeGuid: 2,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("values",values)
      if(param) {
        dispatch(updateMerchantLinkPayment(values))
        .unwrap()
        .then(() => {
          navigate("/link-payment-list");
          toast.info(t("linkPayment.updateMerchantLinkPayment"));
        })
        .catch((error) => {
          dispatch(setLinkPaymentDetailError(error));
          toast.error(error);
        });
      } else {
        dispatch(insertMerchantLinkPayment(values))
        .unwrap()
        .then(() => {
          navigate("/link-payment-list");
          toast.success(t("linkPayment.insertMerchantLinkPayment"));
        })
        .catch((error) => {
          dispatch(setLinkPaymentDetailError(error));
          toast.error(error);
        });
      }
    },
  });

  const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const base64String = e.target.result.split(',')[1];
      formik.setFieldValue('productImageBase64', base64String);
    };
    
    reader.readAsDataURL(file);
  };

  const accordionData = [
    {
      title: t('faq.item1Title'),
      content: t('faq.item1Text'),
    },
    {
      title: t('faq.item2Title'),
      content: t('faq.item2Text'),
    },
    {
      title: t('faq.item3Title'),
      content: t('faq.item3Text'),
    },
    {
      title: t('faq.item4Title'),
      content: t('faq.item4Text'),
    },
    {
      title: t('faq.item5Title'),
      content: t('faq.item5Text'),
    },
  ]

  return (
    <div>
      <div className="payment-page-info-box">
        <i><img src={linkPaymentIcon} alt="" /></i>
        <div>
          <div className="title">{t('linkPayment.paymentDetailTitle')}</div>
          <div className="text">{t('linkPayment.paymentDetailText')}</div>
        </div>
      </div>
      <div className={`link-payment-detail-content ${param ? 'disabled' : ''}`}>
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
            : null
          }
          <div className="row">
            <div className="col-lg-7 left-column">
              <div className="form-item">
                <div className="file-upload-container">
                  {/* <input type="file" onChange={customBase64Uploader} /> */}
                  
                  {
                    formik.values.productImageBase64
                    ? (<img src={`data:image/png;base64,${formik.values.productImageBase64}`} alt={formik.values.productName} />)
                    : (<div className="icon"><img src={fileUploadIcon} alt="" /></div>)
                  }
                  <span>{t("linkPayment.productImageTitle")}</span>
                  <div>{t("linkPayment.productImageSubTitle")}</div>
                  <FileUpload 
                    id="productImageBase64"
                    name="productImageBase64"
                    mode="basic"
                    accept="image/*"
                    chooseLabel={t("linkPayment.productImageUploadButton")}
                    maxFileSize={1000000}
                    onSelect={customBase64Uploader}
                    disabled={loading || param}
                  />
                </div>
              </div>
              <div className="form-item">
                <label htmlFor="productName">{t("linkPayment.productName")}</label>
                <InputText 
                  className="p-form-control"
                  id="productName"
                  name="productName"
                  placeholder={t("linkPayment.productNamePlaceholder")}
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                  invalid={formik.touched.productName && formik.errors.productName}
                  disabled={loading || param}
                />
              </div>
              <div className="form-item">
                <label htmlFor="productDescription">{t("linkPayment.productDescription")}</label>
                <InputTextarea 
                  className="p-form-control"
                  id="productDescription"
                  name="productDescription"
                  placeholder={t("linkPayment.productDescriptionPlaceholder")}
                  value={formik.values.productDescription}
                  onChange={formik.handleChange}
                  invalid={formik.touched.productDescription && formik.errors.productDescription}
                  disabled={loading || param} rows={5} cols={30}
                />
              </div>
              <div className="d-flex gap-4">
                <div className="form-item flex-fill mb-0">
                  <label htmlFor="productPrice">{t("linkPayment.productPrice")}</label>
                  <InputText 
                    className="p-form-control"
                    id="productPrice"
                    name="productPrice"
                    placeholder={t("linkPayment.productPricePlaceholder")}
                    value={formik.values.productPrice}
                    onChange={formik.handleChange}
                    invalid={formik.touched.productPrice && formik.errors.productPrice}
                    disabled={loading || param}
                  />
                </div>
                <div className="form-item">
                  <label htmlFor="productPrice">{t("linkPayment.currencyGuid")}</label>
                  {currencyDef?.length > 0 && (
                    <Dropdown
                      id="currencyGuid"
                      name="currencyGuid"
                      value={formik.values.currencyGuid}
                      onChange={formik.handleChange}
                      invalid={formik.touched.currencyGuid && formik.errors.currencyGuid}
                      disabled={loading || param}
                      options={currencyDef}
                      optionLabel="alphabeticCode"
                      optionValue="guid"
                      className="p-form-control"
                      placeholder=""
                      filter
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-5 right-column">
              <div className="column-title">{t("linkPayment.productInfoTitle")}</div>
              <div className="form-item">
                <div className="input-switch">
                  <InputSwitch
                    id="stockEnabled"
                    name="stockEnabled"
                    checked={formik.values.stockEnabled}
                    onChange={formik.handleChange}
                    disabled={loading || param}
                  />
                  <span>{t("linkPayment.stockEnabled")}</span>
                </div>
                {formik.values.stockEnabled && (
                  <div className="d-flex align-items-center gap-3" style={{width: '120px'}}>
                    <label htmlFor="stock">{t("linkPayment.stock")}</label>
                    <InputText 
                      className="p-form-control"
                      id="stock"
                      name="stock"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      invalid={formik.touched.stock && formik.errors.stock}
                      disabled={loading || param}
                    />
                  </div>
                )}

              </div>
              {/* <div className="form-item">
                <div className="input-switch">
                  <InputSwitch
                    id="installmentInfoEnabled"
                    name="installmentInfoEnabled"
                    checked={formik.values.installmentInfoEnabled}
                    onChange={formik.handleChange}
                  />
                  <span>{t("linkPayment.installmentInfoEnabled")}</span>
                </div>
                <div className="payment-dialog-button" onClick={() => setInstallmentTable(true)}>
                  <img src={installmentTableIcon} />
                  <span>{t('common.installmentTable')}</span>
                </div>
                <Dialog header={t('common.installmentTable')} visible={installmentTable} style={{ width: '1000px' }} onHide={() => {if (!installmentTable) return; setInstallmentTable(false); }}>
                  <div className="d-flex align-items-center flex-column">
                    <img src={installmentTableImg1} alt="" />
                    <img src={installmentTableImg2} alt="" />
                  </div>
                </Dialog>
              </div> */}
              <div className="form-item">
                <div className="input-switch">
                  <InputSwitch
                    id="merchantAddressEnabled"
                    name="merchantAddressEnabled"
                    checked={formik.values.merchantAddressEnabled}
                    onChange={formik.handleChange}
                    disabled={loading || param}
                  />
                  <span>{t("linkPayment.merchantAddressEnabled")}</span>
                </div>
              </div>
              <div className="form-item">
                <div className="input-switch">
                  <InputSwitch
                    id="merchantNameEnabled"
                    name="merchantNameEnabled"
                    checked={formik.values.merchantNameEnabled}
                    onChange={formik.handleChange}
                    disabled={loading || param}
                  />
                  <span>{t("linkPayment.merchantNameEnabled")}</span>
                </div>
              </div>

              <div className="product-types">
                <div className="product-types-title">
                  <span>{t("linkPayment.productTypeTitle")}</span>
                </div>
                <div className="product-types-checkbox">
                  {
                    allProductType.map((item, index)=> (
                      <div className="p-radio-button-item" key={index}>
                          <RadioButton 
                            inputId={item.guid}
                            name="productTypeGuid"
                            value={item.guid}
                            checked={formik.values.productTypeGuid === item.guid}
                            onChange={formik.handleChange}
                            disabled={loading || param}
                          />
                          <label htmlFor={item.guid} className="ml-2">{t(`common.${item.name}`)}</label>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="form-button-item">
                {
                  param ? (
                    <>
                      {/* <Button type="submit" className="third-button" disabled={loading}>
                        <img src={createProductButton} alt="" />
                        <span>{t("linkPayment.updateProductButton")}</span>
                      </Button> */}
                      <Button className="secondary-button" onClick={() => setLinkPaymentPreview(true)}>
                        <img src={previewButtonIcon} alt="" />
                        <span>{t("linkPayment.previewProductButton")}</span>
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" className="primary-button" disabled={loading}>
                      <img src={createProductButton} alt="" />
                      <span>{t("linkPayment.createProductButton")}</span>
                    </Button>
                  )
                }
                <Dialog className="pay-link-dialog" header={t('linkPayment.linkPreviewModalTitle')} visible={linkPaymentPreview} style={{ width: '745px' }} onHide={() => {if (!linkPaymentPreview) return; setLinkPaymentPreview(false); }}>
                  <ProductCard
                    productImage={formik.values.productImageBase64}
                    title={formik.values.productName}
                    description={formik.values.productDescription}
                    price={formik.values.productPrice}
                    priceCurrency={getCurrencyName(formik.values.currencyGuid)}
                    linkUrlKey={formik.values.linkUrlKey}
                  />
                  <div className="link-preview-modal-bottom">
                    <div className="logo">
                      <img src={logo} alt="" height={'30px'} />
                      <span>{t('linkPayment.logoText')}</span>
                    </div>
                    <div className="payment-button">
                      <a href={`/linkpayment/${formik.values.linkUrlKey}`} target="_blank" className="complete-payment-button">
                        <span>{t("linkPayment.completePayment")}</span>
                        <div className="price">{formik.values.productPrice} {getCurrencyName(formik.values.currencyGuid)}</div>
                      </a>
                    </div>
                  </div>
                </Dialog>
              </div>
            </div>
          </div>
        </Form>
        <AccordionList
          title={t('faq.allTopicsTitle')}
          link={'#'}
          data={accordionData}
        />
      </div>
    </div>
  );
}