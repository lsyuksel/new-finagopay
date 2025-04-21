import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService, parseErrorResponse } from "../../services/api";
import { setLoading, setError } from "../../store/slices/login/authSlice";
import OtpVerification from "./OtpVerification";

import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";

import errorIcon from "@/assets/images/alerts/error.svg";
import { getErrorMessage } from "@/utils/helpers.jsx";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [showOtp, setShowOtp] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    dispatch(setError(null));
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.required")),
    password: Yup.string()
      .min(6, t("errors.invalidPassword"))
      .required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await authService.login(values);

        if (response && response.otpDatetime) {
          setLoginData(response);
          setShowOtp(true);
          toast.success(t("messages.success"));
        } else {
          dispatch(setError(t("errors.incorrectPassword")));
          toast.error(t("messages.error"));
        }
      } catch (error) {
        const errorMessage =
          parseErrorResponse(error.response.data).message ||
          t("messages.incorrectPassword");
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  if (showOtp) {
    return <OtpVerification loginData={loginData} />;
  }

  return (
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

      <div className="form-subtitle">{t("login.welcomeSubTitle")}</div>
      <div className="form-title">{t("login.welcomeTitle")}</div>

      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("common.email")}
          type="text"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          isInvalid={formik.touched.email && formik.errors.email}
          disabled={loading}
        />
      </Form.Group>

      <Form.Group className="form-item">
        <Password
          className="p-form-control"
          type="password"
          id="password"
          name="password"
          placeholder={t("common.password")}
          value={formik.values.password}
          onChange={formik.handleChange}
          invalid={formik.touched.password && formik.errors.password}
          disabled={loading}
          feedback={false}
          tabIndex={1}
          toggleMask
        />
      </Form.Group>

      <Form.Group className="form-item">
        <div className="d-flex align-items-center justify-content-between py-2">
          <div className="remember-me">
            <InputSwitch
              checked={checked}
              onChange={(e) => setChecked(e.value)}
            />
            <span>{t("common.rememberMe")}</span>
          </div>
          <div>
            <Link to="/forgot-password" className="forgot-password">
              {t("common.forgotMyPassword")}
            </Link>
          </div>
        </div>
      </Form.Group>

      <Button type="submit" className="login-button" disabled={loading}>
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
          t("common.login")
        )}
      </Button>
    </Form>
  );
};

export default Login;
