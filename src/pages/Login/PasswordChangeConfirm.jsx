import { useLocation } from "react-router-dom";
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
  passwordChangeConfirm,
  setPasswordChangeConfirmError,
} from "../../store/slices/login/passwordChangeConfirmSlice";
import { Password } from "primereact/password";

import errorIcon from "@/assets/images/alerts/error.svg";
import { getErrorMessage } from "@/utils/helpers.jsx";

export default function PasswordChangeConfirm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.passwordChangeConfirm
  );

  useEffect(() => {
    dispatch(setPasswordChangeConfirmError(null));
    !token && navigate("/login");
  }, []);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t("errors.invalidPassword"))
      .required(t("errors.required")),
    passwordAgain: Yup.string()
      .oneOf([Yup.ref("password")], t("errors.passwordsMustMatch"))
      .required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      passwordAgain: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      values = {
        ...values,
        token: token,
      };
      console.log(values);
      dispatch(passwordChangeConfirm(values))
        .unwrap()
        .then((result) => {
          toast.success(t("messages.passwordChangeSuccess"));
          navigate("/login");
        })
        .catch((error) => {
          dispatch(setPasswordChangeConfirmError(error));
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
                      <Password
                        className="p-form-control"
                        type="password"
                        id="password"
                        name="password"
                        placeholder={t("common.password")}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        invalid={
                          formik.touched.password && formik.errors.password
                        }
                        disabled={loading}
                        feedback={false}
                        tabIndex={1}
                        toggleMask
                      />
                    </Form.Group>

                    <Form.Group className="form-item">
                      <Password
                        className="p-form-control"
                        type="password"
                        id="passwordAgain"
                        name="passwordAgain"
                        placeholder={t("common.passwordAgain")}
                        value={formik.values.passwordAgain}
                        onChange={formik.handleChange}
                        invalid={
                          formik.touched.passwordAgain &&
                          formik.errors.passwordAgain
                        }
                        disabled={loading}
                        feedback={false}
                        tabIndex={1}
                        toggleMask
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
