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
  getUserAgreementByCreateAcount,
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

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success, userAgreement } = useSelector(
    (state) => state.register
  );
  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [visibleDialogs, setVisibleDialogs] = useState({});

  useEffect(() => {
    dispatch(setRegisterError(null));
    dispatch(getUserAgreementByCreateAcount());
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearRegisterState());
    };
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t("errors.required")),
    lastName: Yup.string().required(t("errors.required")),
    phone: Yup.string()
      .required(t("errors.required"))
      .test("not-start-with-zero", t("errors.phoneStartsWithZero"), (value) =>
        value ? !value.startsWith("0") : true
      ),
    email: Yup.string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.required")),
    password: Yup.string()
      .min(6, t("errors.invalidPassword"))
      .required(t("errors.required")),
    passwordAgain: Yup.string()
      .oneOf([Yup.ref("password")], t("errors.passwordsMustMatch"))
      .required(t("errors.required")),
    agreements: Yup.array().test(
      "all-agreements",
      t("errors.required"),
      function (value) {
        return selectedAgreements?.length === userAgreement?.length;
      }
    ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: null,
      phoneCode: "90",
      email: "",
      password: "",
      passwordAgain: "",
      agreements: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      values.agreements = selectedAgreements;
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
            mask="9999999999"
            placeholder="9999999999"
            id="phone"
            invalid={formik.touched.phone && formik.errors.phone}
            value={formik.values.phone}
            onChange={formik.handleChange}
            disabled={loading}
          ></InputMask>
        </div>
      </Form.Group>
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
        <Password
          className="p-form-control"
          type="password"
          id="passwordAgain"
          name="passwordAgain"
          placeholder={t("common.passwordAgain")}
          value={formik.values.passwordAgain}
          onChange={formik.handleChange}
          invalid={formik.touched.passwordAgain && formik.errors.passwordAgain}
          disabled={loading}
          feedback={false}
          tabIndex={1}
          toggleMask
        />
      </Form.Group>

      {userAgreement?.map((item, index) => (
        <div className="form-item" key={index}>
          <div className="d-flex align-items-center gap-2">
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
        </div>
      ))}
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
