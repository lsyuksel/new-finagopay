import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  registerUser,
  clearRegisterState,
  setRegisterError,
} from "../../store/slices/login/registerSlice";

import { InputMask } from "primereact/inputmask";

import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";

import { Dialog } from "primereact/dialog";

import errorIcon from "@/assets/images/alerts/error.svg";
import { getErrorMessage } from "@/utils/helpers.jsx";

export default function MemberMerchantApplication() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.register
  );

  useEffect(() => {
    dispatch(setRegisterError(null));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearRegisterState());
    };
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t("errors.required")),
    lastName: Yup.string().required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(registerUser(values))
        .unwrap()
        .then(() => {
          toast.success(t("messages.registerSuccess"));
          navigate("/login");
        })
        .catch((error) => {
          dispatch(setRegisterError(error));
          toast.error(error);
        });
    },
  });

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

      <div className="form-title">{t("login.newAccount")}</div>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("common.firstName")}
          type="text"
          id="firstName"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          isInvalid={formik.touched.firstName && formik.errors.firstName}
          disabled={loading}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("common.lastName")}
          type="text"
          id="lastName"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          isInvalid={formik.touched.lastName && formik.errors.lastName}
          disabled={loading}
        />
      </Form.Group>
      <Button type="submit" className="login-button mx-0" disabled={loading}>
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
          t("common.register")
        )}
      </Button>
    </Form>
  );
}