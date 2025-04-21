import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Message } from "primereact/message";

import LoginHeader from "./components/header";
import LoginFooter from "./components/footer";
import {
  forgotPassword,
  setForgotPasswordError,
} from "../../store/slices/login/forgotPasswordSlice";

import errorIcon from "@/assets/images/alerts/error.svg";
import successIcon from "@/assets/images/alerts/success.svg";
import { getErrorMessage } from "@/utils/helpers.jsx";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.forgotPassword);
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);

  useEffect(() => {
    dispatch(setForgotPasswordError(null));
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
      console.log(values);
      dispatch(forgotPassword(values))
        .unwrap()
        .then((result) => {
          toast.success(t("messages.passwordChangeSuccess"));

          console.log("paswordChange result", result);
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
    <div className="auth-container">
      <LoginHeader pageTitle={t("login.authHeaderTitlepassword")} />
      <div className="auth-content">
        <div className="container">
          <div className="row align-items-strech">
            <div className="col-12">
              <div className="auth-form-area">
                <div className="forgot-password-container">
                  {showPasswordChanged ? (
                    <div className="process-result-container">
                      <div className="title">{t("login.passwordTitle")}</div>
                      <div className="icon">
                        <img src={successIcon} />
                      </div>
                      <div className="result-text success-color">
                        {t("messages.confirmationEmailSent")}
                      </div>
                      <div className='text-content' dangerouslySetInnerHTML={{ __html: t("messages.confirmationEmailContent") }} />
                      <Link to={"/login"} className="login-button mx-auto">
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {t("login.authHeaderTitlelogin")}
                      </Link>
                    </div>
                  ) : (
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
                      <div className="title">{t("login.passwordTitle")}</div>
                      <div className="subtitle">
                        {t("login.passwordSubTitle")}
                      </div>
                      <div className="text">{t("login.passwordText")}</div>
                      <Form.Group className="form-item">
                        <Form.Label style={{ minWidth: "fit-content" }}>
                          {t("login.passwordInputTitle")}
                        </Form.Label>
                        <Form.Control
                          placeholder={t("login.passwordInputPlaceholder")}
                          type="email"
                          id="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.email && formik.errors.email
                          }
                          disabled={loading}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        className="login-button mx-auto"
                        disabled={loading}
                      >
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
      <LoginFooter
        className="login-footer-container"
        text={t("login.footerText")}
      />
    </div>
  );
}
