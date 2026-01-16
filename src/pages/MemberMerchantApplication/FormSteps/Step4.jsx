import React, { useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { getAllPaymentMethodDef } from "../../../store/slices/selectOptionSlice";
import { setApplicationError } from "../../../store/slices/memberMerchantApplication/memberMerchantApplicationSlice";

export default function Step4({ formik, onValidate }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { allPaymentMethod } = useSelector((state) => state.selectOptions);

  // API çağrısını yap
  useEffect(() => {
    dispatch(getAllPaymentMethodDef());
  }, [dispatch]);

  const validateStep = useCallback(async () => {
    const fieldsToValidate = [
      "paymentMethodGuid",
      "webUrl",
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
    <div className="form-item-wrapper">
      <Form.Group className="form-item w-100">
        <Dropdown
          id="paymentMethodGuid"
          name="paymentMethodGuid"
          value={formik.values.paymentMethodGuid}
          onChange={(e) => formik.setFieldValue("paymentMethodGuid", e.value)}
          options={allPaymentMethod}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.paymentMethod")}
          className={formik.touched.paymentMethodGuid && formik.errors.paymentMethodGuid ? "p-invalid" : ""}
          style={{ width: "100%" }}
          appendTo="self"
        />
      </Form.Group>
      <Form.Group className="form-item w-100">
        <Form.Control
          placeholder={t("memberMerchantApplication.webUrl")}
          type="text"
          id="webUrl"
          name="webUrl"
          value={formik.values.webUrl}
          onChange={formik.handleChange}
          isInvalid={formik.touched.webUrl && formik.errors.webUrl}
        />
      </Form.Group>
    </div>
  );
}

