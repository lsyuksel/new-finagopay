import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Message } from "primereact/message";

import LoginHeader from './components/header';
import LoginFooter from './components/footer';
import { forgotPassword, setForgotPasswordError } from "../../store/slices/forgotPasswordSlice";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);

  useEffect(() => {
    dispatch(setForgotPasswordError(error));
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      dispatch(forgotPassword(values))
        .unwrap()
        .then((result) => {
          toast.success(t("messages.passwordChangeSuccess"));
          
          console.log("paswordChange result",result);
          setShowPasswordChanged(true);
          // navigate('/login');
        })
        .catch((error) => {
          dispatch(setForgotPasswordError(error));
          toast.error(error);
        });
    },
  });

    return (
        <div className='auth-container'>
            <LoginHeader pageTitle={t('login.authHeaderTitlepassword')} />
            <div className="auth-content">
                <div className="container">
                <div className="row align-items-strech">
                    <div className="col-12">
                        <div className="auth-form-area">
                          <div className="forgot-password-container">
                            {showPasswordChanged ? (
                              <div>
                                <div className="title">{t('login.passwordTitle')}</div>
                                Şifre Değiştirildi blabla
                              </div>
                            ) : (
                              <Form onSubmit={formik.handleSubmit}>
                                {formik.touched.email && formik.errors.email && (
                                  <Message
                                    severity="error"
                                    className="d-flex justify-content-start gap-1 mb-4"
                                    content={
                                      <>
                                        <svg
                                          width="22"
                                          height="22"
                                          viewBox="0 0 22 22"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M21.0729 16.9113C19.0112 13.2432 16.9489 9.57369 14.8866 5.90495C14.3613 4.96984 13.837 4.03931 13.3136 3.10442C13.0298 2.55231 12.676 1.97536 12.086 1.70968C11.6874 1.52365 11.2966 1.42152 10.8541 1.45005C10.1 1.49329 9.39537 1.91666 8.99294 2.55444C8.85798 2.79307 8.7276 3.03336 8.58815 3.27162C8.0274 4.27382 7.46061 5.27693 6.89858 6.27896C4.88312 9.93456 2.75084 13.5295 0.793731 17.2149C0.817928 17.1181 0.861916 17.0279 0.908133 16.9421C-0.0544954 18.4772 1.06235 20.5686 2.89252 20.5566C3.15867 20.5588 3.42709 20.5566 3.69327 20.5566H19.1061C20.9576 20.5401 22.0512 18.4739 21.0729 16.9113ZM11.8375 17.1225C11.1062 17.8588 9.81192 17.3238 9.81794 16.2865C9.79924 15.6519 10.372 15.0926 11.0015 15.1029C12.0405 15.0934 12.5786 16.4004 11.8375 17.1225ZM12.1829 12.6588C12.1899 13.6985 10.8874 14.2339 10.1633 13.4947C9.95211 13.2792 9.81792 12.9602 9.81792 12.6588V9.36109C9.87715 7.79755 12.1265 7.79886 12.1829 9.36111C12.1829 9.36109 12.1829 12.6588 12.1829 12.6588Z"
                                            fill="#F04438"
                                          />
                                          <path
                                            d="M0.789062 17.2142C0.813259 17.1174 0.857247 17.0272 0.903464 16.9414C0.868257 17.0316 0.828673 17.1218 0.789062 17.2142Z"
                                            fill="#F04438"
                                          />
                                        </svg>
                                        <div>
                                          <b>Hata: </b>
                                          {formik.touched.email && formik.errors.email}
                                        </div>
                                      </>
                                    }
                                  />
                                )}
                                {error && (
                                  <Message
                                    severity="error"
                                    className="d-flex justify-content-start gap-1 mb-4"
                                    content={
                                      <>
                                        <svg
                                          width="22"
                                          height="22"
                                          viewBox="0 0 22 22"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M21.0729 16.9113C19.0112 13.2432 16.9489 9.57369 14.8866 5.90495C14.3613 4.96984 13.837 4.03931 13.3136 3.10442C13.0298 2.55231 12.676 1.97536 12.086 1.70968C11.6874 1.52365 11.2966 1.42152 10.8541 1.45005C10.1 1.49329 9.39537 1.91666 8.99294 2.55444C8.85798 2.79307 8.7276 3.03336 8.58815 3.27162C8.0274 4.27382 7.46061 5.27693 6.89858 6.27896C4.88312 9.93456 2.75084 13.5295 0.793731 17.2149C0.817928 17.1181 0.861916 17.0279 0.908133 16.9421C-0.0544954 18.4772 1.06235 20.5686 2.89252 20.5566C3.15867 20.5588 3.42709 20.5566 3.69327 20.5566H19.1061C20.9576 20.5401 22.0512 18.4739 21.0729 16.9113ZM11.8375 17.1225C11.1062 17.8588 9.81192 17.3238 9.81794 16.2865C9.79924 15.6519 10.372 15.0926 11.0015 15.1029C12.0405 15.0934 12.5786 16.4004 11.8375 17.1225ZM12.1829 12.6588C12.1899 13.6985 10.8874 14.2339 10.1633 13.4947C9.95211 13.2792 9.81792 12.9602 9.81792 12.6588V9.36109C9.87715 7.79755 12.1265 7.79886 12.1829 9.36111C12.1829 9.36109 12.1829 12.6588 12.1829 12.6588Z"
                                            fill="#F04438"
                                          />
                                          <path
                                            d="M0.789062 17.2142C0.813259 17.1174 0.857247 17.0272 0.903464 16.9414C0.868257 17.0316 0.828673 17.1218 0.789062 17.2142Z"
                                            fill="#F04438"
                                          />
                                        </svg>
                                        <div>
                                          <b>Hata: </b>
                                          {error}
                                        </div>
                                      </>
                                    }
                                  />
                                )}
                                <div className="title">{t('login.passwordTitle')}</div>
                                <div className="subtitle">{t('login.passwordSubTitle')}</div>
                                <div className="text">{t('login.passwordText')}</div>
                                <Form.Group className="form-item">
                                  <Form.Label style={{minWidth:'fit-content'}}>{t("login.passwordInputTitle")}</Form.Label>
                                  <Form.Control
                                    placeholder={t("login.passwordInputPlaceholder")}
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    isInvalid={formik.touched.email && formik.errors.email}
                                    disabled={loading}
                                  />
                                </Form.Group>
                                <Button type="submit" className="login-button mx-auto" disabled={loading}>
                                  {loading ? (
                                    <>
                                      <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                      ></span>
                                      {t("common.loading")}
                                    </>
                                  ) : (
                                    t("common.submit")
                                  )}
                                </Button>
                              </Form>
                            )}
                          </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <LoginFooter className="login-footer-container" text={t('login.footerText')} />
        </div>
    )
}
