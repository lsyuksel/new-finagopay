import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import {
  setCredentials,
  setLoading,
  setError,
} from "../../store/slices/authSlice";
import { registerUser, clearRegisterState, getUserAgreementByCreateAcount } from "../../store/slices/registerSlice";

import { InputMask } from "primereact/inputmask";

import { Message } from "primereact/message";
import { Password } from "primereact/password";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";

export default function Register() {
  
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  const { success, userAgreement } = useSelector((state) => state.register);

  useEffect(() => {
    dispatch(setError(null));
    dispatch(getUserAgreementByCreateAcount());
    
    setTimeout(() => {
      console.log("userAgreement",userAgreement);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearRegisterState());
    };
  }, []);

/*  useEffect(() => {
    if (success) {
      toast.success(t("messages.registerSuccess"));
      navigate('/login');
    }
  }, [success]);*/

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required(t("errors.required")),
    lastName: Yup.string()
      .required(t("errors.required")),
    phone: Yup.string()
      .required(t("errors.required")),
    email: Yup.string()
      .email(t("errors.invalidEmail"))
      .required(t("errors.required")),
    password: Yup.string()
      .min(6, t("errors.invalidPassword"))
      .required(t("errors.required")),
    passwordAgain: Yup.string()
      .oneOf([Yup.ref('password')], t("errors.passwordsMustMatch"))
      .required(t("errors.required")),
/*
      check1: Yup.boolean()
      .oneOf([true], t('validation.mustAccept'))
      .required(t('validation.required')),
    check2: Yup.boolean()
      .oneOf([true], t('validation.mustAccept'))
      .required(t('validation.required'))
*/
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      passwordAgain: "",
      userAgreements: [],
      check1: false,
      check2: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      dispatch(registerUser(values))
        .unwrap()
        .then(() => {
          toast.success(t("messages.registerSuccess"));
          navigate('/login');
        })
        .catch((error) => {
          dispatch(setError(error));
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

      <div className="form-title">{t("login.newAccount")}</div>

      <Form.Group className="form-item">
        <InputMask
          className="p-form-control"
          mask="(999) 999-9999"
          placeholder="(999) 999-9999"
          id="phone"
          invalid={formik.touched.phone && formik.errors.phone}
          value={formik.values.phone}
          onChange={formik.handleChange}
          disabled={loading}>
        </InputMask>

        {formik.touched.phone && formik.errors.phone && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.phone && formik.errors.phone}
          />
        )}
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

        {formik.touched.firstName && formik.errors.firstName && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.firstName && formik.errors.firstName}
          />
        )}
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

        {formik.touched.lastName && formik.errors.lastName && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.lastName && formik.errors.lastName}
          />
        )}
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

        {formik.touched.passwordAgain && formik.errors.passwordAgain && (
          <Message
            className="d-flex"
            severity="error"
            text={formik.touched.passwordAgain && formik.errors.passwordAgain}
          />
        )}
      </Form.Group>
      
        {
          userAgreement?.map((item,index)=>(
            <div className="field mb-3" key={index}>
              <div className="d-flex align-items-center gap-2">
                <InputSwitch
                  inputId="check1"
                  name="check1"
                  checked={formik.values.check1}
                  onChange={(e) => formik.setFieldValue('check1', e.value)}
                  className={classNames({ 'p-invalid': formik.touched.check1 && formik.errors.check1 })}
                />
                <label htmlFor="check1" className="cursor-pointer">
                  <b>{item.guid}</b><br />
                  <b>{item.name}</b><br />
                  {t("common.check1")}
                </label>
              </div>
              {/*formik.touched.check1 && formik.errors.check1 && (
                <Message
                  className="p-error"
                  text={formik.touched.check1 && formik.errors.check1}
                />
              )*/}
            </div>
          ))
        }

      <div className="field mb-3">
        <div className="d-flex align-items-center gap-2">
          <InputSwitch
            inputId="check2"
            name="check2"
            checked={formik.values.check2}
            onChange={(e) => formik.setFieldValue('check2', e.value)}
            className={classNames({ 'p-invalid': formik.touched.check2 && formik.errors.check2 })}
          />
          <label htmlFor="check2" className="cursor-pointer">
            {t("common.check2")}
          </label>
        </div>
        {/*formik.touched.check2 && formik.errors.check2 && (
          <Message
            className="p-error"
            text={formik.touched.check2 && formik.errors.check2}
          />
        )*/}
      </div>
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
          t("common.register")
        )}
      </Button>
    </Form>
  );
}
