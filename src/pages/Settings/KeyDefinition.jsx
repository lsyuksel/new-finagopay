import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Password } from "primereact/password";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { merchantGetKeys, merchantGetProfile, merchantInsertLogo, merchantUpdateKeys } from '../../store/slices/settings/keyDefinitionSlice';
import { FileUpload } from 'primereact/fileupload';
import fileUploadIcon from "@/assets/images/icons/fileUploadIcon.svg";

const KeyDefinition = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const { loading, error, success, merchantProfile, merchantKeys } = useSelector((state) => state.keyDefinition);

  useEffect(() => {
    dispatch(merchantGetProfile(authData.merchantId));
    dispatch(merchantGetKeys(authData.merchantId));
  }, [])

  useEffect(() => {
    if(merchantProfile) {
      console.log("merchantProfile-merchantKeys", [merchantProfile,merchantKeys]);
    }
    formik.setValues({
      clientId: merchantKeys?.clientId || "",
      clientSecret: merchantKeys?.clientSecret || "",
      apiSecret: merchantKeys?.apiSecret || "",

      productImageBase64: merchantProfile?.logo || null,
    });
  }, [merchantProfile, merchantKeys])

  const validationSchema = Yup.object().shape({
    apiSecret: Yup.string()
      .min(15, t("errors.minLength", { length: 15 }))
      .required(t("errors.required")),
    clientId: Yup.string()
      .required(t("errors.required")),
    clientSecret: Yup.string()
      .required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      clientId: "",
      clientSecret: "",
      apiSecret: "",

      productImageBase64: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      // console.log("useFormik values",values)
      dispatch(merchantUpdateKeys({
        merchantId: `${authData.merchantId}`,

        apiSecret: values.apiSecret,

        userEmail: authData.user.userName
      }))
      .unwrap()
      .then(() => {
        toast.success(t("messages.success"));
      })
      .catch((error) => {
        dispatch(setUserDefinitionError(error));
        toast.error(error);
      });
    },
  });

  const handleCopyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("messages.copySuccess"));
    } catch (err) {
      toast.error(t("messages.copyError"));
    }
  };

  const customBase64Uploader = async (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const base64String = e.target.result.split(',')[1];
      dispatch(merchantInsertLogo({
        merchantId: `${authData.merchantId}`,
        merchantLogo: base64String,
      }))
      .unwrap()
      .then(() => {
        toast.success(t("messages.success"));
      })
      .catch((error) => {
        dispatch(setUserDefinitionError(error));
        toast.error(error);
      });
      formik.setFieldValue('productImageBase64', base64String);
    };
    
    reader.readAsDataURL(file);

  };

  return (
    <div className="settings-container">
      <div className="back-button" onClick={()=>navigate('/')}>
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.3871 0.209705L4.29289 0.292893L0.292893 4.29289C-0.0675907 4.65338 -0.0953203 5.22061 0.209705 5.6129L0.292893 5.70711L4.29289 9.70711C4.68342 10.0976 5.31658 10.0976 5.70711 9.70711C6.06759 9.34662 6.09532 8.77939 5.7903 8.3871L5.70711 8.29289L3.414 5.999L12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4L3.416 3.999L5.70711 1.70711C6.06759 1.34662 6.09532 0.779392 5.7903 0.387101L5.70711 0.292893C5.34662 -0.0675907 4.77939 -0.0953203 4.3871 0.209705Z" fill="#8200BA"/>
        </svg>
        <span>{ t('settings.returnHome') }</span>
      </div>
      <div className="title">{ t('settings.keydefinitionTitle') }</div>
      <div className="profile-box-section-wrapper">
        <div className="row">
          <div className="col-12">
            <div className="profile-box">
              <Form onSubmit={formik.handleSubmit}>
                <div className="profile-box-title">
                  <span>{ t('settings.keydefinitionTitle1') }</span>
                  <div className="button-wrapper">
                    <div onClick={formik.handleSubmit}>
                      <span>{ t('common.save') }</span>
                      <i className='pi pi-save'></i>
                    </div>
                  </div>
                </div>
                <div className='profile-box-content'>
                  <div className="api-input-wrapper">
                    <Form.Group className="form-item">
                      <div className="label">{ t('settings.keydefinitionApiSecret') }</div>
                      <Password
                        className="p-form-control"
                        id="apiSecret"
                        name="apiSecret"
                        value={formik.values.apiSecret}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.apiSecret && formik.errors.apiSecret}
                        feedback={false}
                        tabIndex={1}
                        toggleMask
                      />
                      <div className="copy-button" onClick={() => handleCopyToClipboard(formik.values.apiSecret, 'apiSecret')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2.96786 15.58H4.58412V17.0406C4.58412 19.0072 5.56711 20 7.55198 20H17.0416C19.0076 20 20 19.0072 20 17.0406V7.37948C20 5.41289 19.0076 4.42005 17.0416 4.42005H15.4159V2.95943C15.4159 0.99284 14.4234 0 12.4575 0H2.96786C0.982987 0 0 0.99284 0 2.95943V12.6205C0 14.5871 0.982987 15.58 2.96786 15.58ZM2.98677 14.043C2.04159 14.043 1.52174 13.5274 1.52174 12.5346V3.04535C1.52174 2.05251 2.04159 1.53699 2.98677 1.53699H12.4291C13.3648 1.53699 13.8941 2.05251 13.8941 3.04535V4.42005H7.55198C5.56711 4.42005 4.58412 5.40334 4.58412 7.37948V14.043H2.98677ZM7.57089 18.463C6.63516 18.463 6.10586 17.9475 6.10586 16.9547V7.46539C6.10586 6.47255 6.63516 5.95704 7.57089 5.95704H17.0132C17.949 5.95704 18.4783 6.47255 18.4783 7.46539V16.9547C18.4783 17.9475 17.949 18.463 17.0132 18.463H7.57089Z" fill="#1D7AFC"/>
                        </svg>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-item">
                      <div className="label">{ t('settings.keydefinitionClientId') }</div>
                      <Password
                        className="p-form-control"
                        id="clientId"
                        name="clientId"
                        value={formik.values.clientId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.clientId && formik.errors.clientId}
                        feedback={false}
                        tabIndex={1}
                        disabled
                        toggleMask
                      />
                      <div className="copy-button" onClick={() => handleCopyToClipboard(formik.values.clientId, 'clientId')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2.96786 15.58H4.58412V17.0406C4.58412 19.0072 5.56711 20 7.55198 20H17.0416C19.0076 20 20 19.0072 20 17.0406V7.37948C20 5.41289 19.0076 4.42005 17.0416 4.42005H15.4159V2.95943C15.4159 0.99284 14.4234 0 12.4575 0H2.96786C0.982987 0 0 0.99284 0 2.95943V12.6205C0 14.5871 0.982987 15.58 2.96786 15.58ZM2.98677 14.043C2.04159 14.043 1.52174 13.5274 1.52174 12.5346V3.04535C1.52174 2.05251 2.04159 1.53699 2.98677 1.53699H12.4291C13.3648 1.53699 13.8941 2.05251 13.8941 3.04535V4.42005H7.55198C5.56711 4.42005 4.58412 5.40334 4.58412 7.37948V14.043H2.98677ZM7.57089 18.463C6.63516 18.463 6.10586 17.9475 6.10586 16.9547V7.46539C6.10586 6.47255 6.63516 5.95704 7.57089 5.95704H17.0132C17.949 5.95704 18.4783 6.47255 18.4783 7.46539V16.9547C18.4783 17.9475 17.949 18.463 17.0132 18.463H7.57089Z" fill="#1D7AFC"/>
                        </svg>
                      </div>
                    </Form.Group>
                    <Form.Group className="form-item">
                      <div className="label">{ t('settings.keydefinitionClientSecret') }</div>
                      <Password
                        className="p-form-control"
                        id="clientSecret"
                        name="clientSecret"
                        value={formik.values.clientSecret}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={formik.touched.clientSecret && formik.errors.clientSecret}
                        feedback={false}
                        tabIndex={2}
                        disabled
                        toggleMask
                      />
                      <div className="copy-button" onClick={() => handleCopyToClipboard(formik.values.clientSecret, 'clientSecret')}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2.96786 15.58H4.58412V17.0406C4.58412 19.0072 5.56711 20 7.55198 20H17.0416C19.0076 20 20 19.0072 20 17.0406V7.37948C20 5.41289 19.0076 4.42005 17.0416 4.42005H15.4159V2.95943C15.4159 0.99284 14.4234 0 12.4575 0H2.96786C0.982987 0 0 0.99284 0 2.95943V12.6205C0 14.5871 0.982987 15.58 2.96786 15.58ZM2.98677 14.043C2.04159 14.043 1.52174 13.5274 1.52174 12.5346V3.04535C1.52174 2.05251 2.04159 1.53699 2.98677 1.53699H12.4291C13.3648 1.53699 13.8941 2.05251 13.8941 3.04535V4.42005H7.55198C5.56711 4.42005 4.58412 5.40334 4.58412 7.37948V14.043H2.98677ZM7.57089 18.463C6.63516 18.463 6.10586 17.9475 6.10586 16.9547V7.46539C6.10586 6.47255 6.63516 5.95704 7.57089 5.95704H17.0132C17.949 5.95704 18.4783 6.47255 18.4783 7.46539V16.9547C18.4783 17.9475 17.949 18.463 17.0132 18.463H7.57089Z" fill="#1D7AFC"/>
                        </svg>
                      </div>
                    </Form.Group>
                  </div>
                  {formik.touched.apiSecret && formik.errors.apiSecret && (
                    <div className="error-message text-start">{formik.errors.apiSecret}</div>
                  )}
                </div>
              </Form>
            </div>
          </div>

          
          <div className="col-12 col-lg-6">
            <div className="profile-box">
              <div className="profile-box-title">{ t('settings.keydefinitionTitle2') }</div>
              <div className='profile-box-content'>
                <div className="profile-table">
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle1') }</div>
                    <div>
                      <div>
                        <span>{ merchantProfile?.merchantId }</span>
                        <div className="copy-button" onClick={() => handleCopyToClipboard(merchantProfile?.merchantId, 'merchantId')}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.96786 15.58H4.58412V17.0406C4.58412 19.0072 5.56711 20 7.55198 20H17.0416C19.0076 20 20 19.0072 20 17.0406V7.37948C20 5.41289 19.0076 4.42005 17.0416 4.42005H15.4159V2.95943C15.4159 0.99284 14.4234 0 12.4575 0H2.96786C0.982987 0 0 0.99284 0 2.95943V12.6205C0 14.5871 0.982987 15.58 2.96786 15.58ZM2.98677 14.043C2.04159 14.043 1.52174 13.5274 1.52174 12.5346V3.04535C1.52174 2.05251 2.04159 1.53699 2.98677 1.53699H12.4291C13.3648 1.53699 13.8941 2.05251 13.8941 3.04535V4.42005H7.55198C5.56711 4.42005 4.58412 5.40334 4.58412 7.37948V14.043H2.98677ZM7.57089 18.463C6.63516 18.463 6.10586 17.9475 6.10586 16.9547V7.46539C6.10586 6.47255 6.63516 5.95704 7.57089 5.95704H17.0132C17.949 5.95704 18.4783 6.47255 18.4783 7.46539V16.9547C18.4783 17.9475 17.949 18.463 17.0132 18.463H7.57089Z" fill="#1D7AFC"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle2') }</div>
                    <div>{ merchantProfile?.companyType }</div>
                  </div>
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle3') }</div>
                    <div>{ merchantProfile?.email }</div>
                  </div>
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle4') }</div>
                    <div>{ merchantProfile?.legalTitle }</div>
                  </div>
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle5') }</div>
                    <div>
                      <a href={ merchantProfile?.webSite } target='_blank'>
                        <span>{ merchantProfile?.webSite }</span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M15.5211 9.47652C15.342 9.47652 15.1703 9.54766 15.0436 9.67429C14.917 9.80091 14.8459 9.97266 14.8459 10.1517V12.8698C14.8453 13.3947 14.6365 13.898 14.2653 14.2692C13.8941 14.6404 13.3908 14.8492 12.8658 14.8498H5.13127C4.6063 14.8492 4.10301 14.6404 3.73181 14.2692C3.36061 13.898 3.1518 13.3947 3.15121 12.8698V5.13518C3.1518 4.61022 3.36061 4.10692 3.73181 3.73572C4.10301 3.36451 4.6063 3.15571 5.13127 3.15511H7.84928C8.02835 3.15511 8.2001 3.08398 8.32672 2.95735C8.45335 2.83072 8.52449 2.65898 8.52449 2.4799C8.52449 2.30082 8.45335 2.12908 8.32672 2.00245C8.2001 1.87583 8.02835 1.80469 7.84928 1.80469H5.13127C4.24829 1.80573 3.40177 2.15695 2.77741 2.78132C2.15305 3.40568 1.80182 4.2522 1.80078 5.13518V12.8698C1.80182 13.7527 2.15305 14.5992 2.77741 15.2236C3.40177 15.848 4.24829 16.1992 5.13127 16.2002H12.8658C13.7488 16.1992 14.5953 15.848 15.2197 15.2236C15.844 14.5992 16.1953 13.7527 16.1963 12.8698V10.1517C16.1963 9.97266 16.1252 9.80091 15.9985 9.67429C15.8719 9.54766 15.7002 9.47652 15.5211 9.47652Z" fill="#1D7AFC"/>
                          <path d="M15.5065 1.7998H11.309C11.1321 1.79977 10.9624 1.86909 10.8361 1.99287C10.7099 2.11665 10.6372 2.28502 10.6337 2.4618C10.6267 2.84076 10.9455 3.15023 11.3241 3.15023H13.8936L8.51611 8.52943C8.38949 8.65606 8.31836 8.8278 8.31836 9.00687C8.31836 9.18594 8.38949 9.35767 8.51611 9.4843C8.64273 9.61092 8.81447 9.68205 8.99354 9.68205C9.17261 9.68205 9.34435 9.61092 9.47097 9.4843L14.8502 4.10678V6.68554C14.8502 6.86462 14.9213 7.03636 15.0479 7.16299C15.1746 7.28961 15.3463 7.36075 15.5254 7.36075C15.7045 7.36075 15.8762 7.28961 16.0028 7.16299C16.1294 7.03636 16.2006 6.86462 16.2006 6.68554V2.49359C16.2006 2.40245 16.1826 2.31221 16.1478 2.22802C16.1129 2.14383 16.0617 2.06734 15.9973 2.00291C15.9328 1.93848 15.8563 1.88738 15.7721 1.85253C15.6879 1.81769 15.5977 1.79977 15.5065 1.7998Z" fill="#1D7AFC"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="profile-box">
              <div className="profile-box-title">{ t('settings.keydefinitionTitle3') }</div>
              <div className='profile-box-content'>
                <div className="profile-table custom-table">
                  <div className='item'>
                    <div>{ t('settings.keydefinitionTableTitle6') }</div>
                    <div>
                      <Form.Control
                        placeholder={t("common.email")}
                        type="text"
                        id="iban"
                        name="iban"
                        value={merchantProfile?.iban || ""}
                        disabled
                      />
                      {/* { merchantProfile?.iban } */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-box">
              <div className="profile-box-title">{ t('settings.keydefinitionTitle4') }</div>
              <div className='profile-box-content'>
                <div className="file-upload-container">
                  {
                    formik.values.productImageBase64
                    ? (<img src={`data:image/png;base64,${formik.values.productImageBase64}`} />)
                    : (<div className="icon"><img src={fileUploadIcon} alt="" /></div>)
                  }
                  <div>{t("linkPayment.productImageSubTitle")}</div>
                  <FileUpload 
                    id="productImageBase64"
                    name="productImageBase64"
                    mode="basic"
                    accept="image/*"
                    chooseLabel={t("linkPayment.productImageUploadButton")}
                    maxFileSize={1000000}
                    onSelect={customBase64Uploader}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

                {/* <h4 className='m-0'>API Anahtarı :{ merchantKeys?.apiSecret }</h4>
                <h4 style={{wordWrap: "break-word"}}>Güvenlik Anahtarı : { merchantKeys?.clientSecret }</h4>
                <button onClick={()=> updateMerchantKeys()}>Test Update Key</button> */}

export default KeyDefinition; 