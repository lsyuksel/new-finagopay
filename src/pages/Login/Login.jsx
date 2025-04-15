import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService, parseErrorResponse } from "../../services/api";
import {
  setCredentials,
  setLoading,
  setError,
} from "../../store/slices/authSlice";
import OtpVerification from "./OtpVerification";

import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";

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
    email: Yup.string().required(t("errors.required")),
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
        const errorMessage = parseErrorResponse(error.response.data).message || t("messages.incorrectPassword")
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

      <div className="form-subtitle">{t("login.welcomeSubTitle")}</div>
      <div className="form-title">{t("login.welcomeTitle")}</div>

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

        {formik.touched.email && formik.errors.email && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.email && formik.errors.email}
          />
        )}
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

        {formik.touched.password && formik.errors.password && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.password && formik.errors.password}
          />
        )}
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