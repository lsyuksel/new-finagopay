import React, { useCallback, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Calendar } from "primereact/calendar";
import { setApplicationError } from "../../../store/slices/memberMerchantApplication/memberMerchantApplicationSlice";
import { useDispatch } from "react-redux";

export default function Step1({ formik, onValidate }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const validateStep = useCallback(async () => {
    const fieldsToValidate = [
      "contactName",
      "contactSurname",
      "contactEmail",
      "contactPhoneNumber",
      "ownerIdentityNumber",
      "contactDateOfBirth",
    ];
    
    const errors = await formik.validateForm();
    
    fieldsToValidate.forEach((field) => {
      formik.setFieldTouched(field, true);
    });

    const stepErrors = fieldsToValidate.filter(
      (field) => errors[field]
    );

    return stepErrors.length === 0;
  }, [formik]);

  useEffect(() => {
    if (onValidate) {
      onValidate(validateStep);
    }
  }, [validateStep, onValidate]);

  useEffect(() => {
    dispatch(setApplicationError(null));
  }, []);
  return (
    <>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.contactName")}
          type="text"
          id="contactName"
          name="contactName"
          value={formik.values.contactName}
          onChange={formik.handleChange}
          isInvalid={formik.touched.contactName && formik.errors.contactName}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.contactEmail")}
          type="email"
          id="contactEmail"
          name="contactEmail"
          value={formik.values.contactEmail}
          onChange={formik.handleChange}
          isInvalid={formik.touched.contactEmail && formik.errors.contactEmail}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.ownerIdentityNumber")}
          type="text"
          id="ownerIdentityNumber"
          name="ownerIdentityNumber"
          value={formik.values.ownerIdentityNumber}
          onChange={formik.handleChange}
          isInvalid={formik.touched.ownerIdentityNumber && formik.errors.ownerIdentityNumber}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.contactSurname")}
          type="text"
          id="contactSurname"
          name="contactSurname"
          value={formik.values.contactSurname}
          onChange={formik.handleChange}
          isInvalid={formik.touched.contactSurname && formik.errors.contactSurname}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.contactPhoneNumber")}
          type="text"
          id="contactPhoneNumber"
          name="contactPhoneNumber"
          value={formik.values.contactPhoneNumber}
          onChange={formik.handleChange}
          isInvalid={formik.touched.contactPhoneNumber && formik.errors.contactPhoneNumber}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Calendar
          id="contactDateOfBirth"
          name="contactDateOfBirth"
          value={formik.values.contactDateOfBirth}
          onChange={(e) => formik.setFieldValue("contactDateOfBirth", e.value)}
          dateFormat="dd.mm.yy"
          placeholder={t("memberMerchantApplication.contactDateOfBirth")}
          className={formik.touched.contactDateOfBirth && formik.errors.contactDateOfBirth ? "p-invalid" : ""}
        />
      </Form.Group>
    </>
  );
}