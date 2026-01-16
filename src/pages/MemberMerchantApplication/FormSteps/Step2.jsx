import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCompanyTypeDef,
  getAllMccDef,
  getAllCityDef,
  getDistrictDefinitions,
  getAllCountry,
} from "../../../store/slices/selectOptionSlice";
import { setApplicationError } from "../../../store/slices/memberMerchantApplication/memberMerchantApplicationSlice";

export default function Step2({ formik, onValidate }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const {
    allCompanyTypeDef,
    allMccDef,
    allCityDef,
    allDistrictDef,
    allCardAcceptorCountry,
  } = useSelector((state) => state.selectOptions);

  const [filteredDistricts, setFilteredDistricts] = useState([]);

  // API çağrılarını yap
  useEffect(() => {
    dispatch(getAllCompanyTypeDef());
    dispatch(getAllMccDef());
    dispatch(getAllCountry());
    // Tüm ilçeleri bir kerede getir
    dispatch(getDistrictDefinitions());
  }, [dispatch]);

  // Ülke seçildiğinde şehirleri getir
  useEffect(() => {
    if (formik.values.countryGuid && formik.values.countryGuid == '230426105500418781') {
      dispatch(getAllCityDef(formik.values.countryGuid));
    } else {
      if (formik.values.cityGuid) {
        formik.setFieldValue("cityGuid", null);
      }
    }
  }, [formik.values.countryGuid, dispatch]);

  // Şehir seçildiğinde ilçeleri filtrele
  useEffect(() => {
    if (formik.values.cityGuid) {
      const filtered = allDistrictDef.filter(
        (district) => district.cityGuid === formik.values.cityGuid
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
      if (formik.values.districtGuid) {
        formik.setFieldValue("districtGuid", null);
      }
    }
  }, [formik.values.cityGuid, allDistrictDef]);

  const validateStep = useCallback(async () => {
    const fieldsToValidate = [
      "companyTypeGuid",
      "taxOffice",
      "taxNumber",
      "companyName",
      "commercialName",
      "tradeRegisterNumber",
      "mccGuid",
      "countryGuid",
      "cityGuid",
      "districtGuid",
      "postalCode",
      "neighborhood",
      "addressline1",
      "addressline2",
      "addressline3",
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
      <Form.Group className="form-item">
        <Dropdown
          id="companyTypeGuid"
          name="companyTypeGuid"
          value={formik.values.companyTypeGuid}
          onChange={(e) => formik.setFieldValue("companyTypeGuid", e.value)}
          options={allCompanyTypeDef}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.companyType")}
          className={formik.touched.companyTypeGuid && formik.errors.companyTypeGuid ? "p-invalid" : ""}
          appendTo="self"
          filter
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.taxOffice")}
          type="text"
          id="taxOffice"
          name="taxOffice"
          value={formik.values.taxOffice}
          onChange={formik.handleChange}
          isInvalid={formik.touched.taxOffice && formik.errors.taxOffice}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.taxNumber")}
          type="text"
          id="taxNumber"
          name="taxNumber"
          value={formik.values.taxNumber}
          onChange={formik.handleChange}
          isInvalid={formik.touched.taxNumber && formik.errors.taxNumber}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.companyName")}
          type="text"
          id="companyName"
          name="companyName"
          value={formik.values.companyName}
          onChange={formik.handleChange}
          isInvalid={formik.touched.companyName && formik.errors.companyName}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.commercialName")}
          type="text"
          id="commercialName"
          name="commercialName"
          value={formik.values.commercialName}
          onChange={formik.handleChange}
          isInvalid={formik.touched.commercialName && formik.errors.commercialName}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.tradeRegisterNumber")}
          type="text"
          id="tradeRegisterNumber"
          name="tradeRegisterNumber"
          value={formik.values.tradeRegisterNumber}
          onChange={formik.handleChange}
          isInvalid={formik.touched.tradeRegisterNumber && formik.errors.tradeRegisterNumber}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Dropdown
          id="mccGuid"
          name="mccGuid"
          value={formik.values.mccGuid}
          onChange={(e) => formik.setFieldValue("mccGuid", e.value)}
          options={allMccDef}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.mcc")}
          className={formik.touched.mccGuid && formik.errors.mccGuid ? "p-invalid" : ""}
          appendTo="self"
          filter
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Dropdown
          id="countryGuid"
          name="countryGuid"
          value={formik.values.countryGuid}
          onChange={(e) => formik.setFieldValue("countryGuid", e.value)}
          options={allCardAcceptorCountry}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.country")}
          className={formik.touched.countryGuid && formik.errors.countryGuid ? "p-invalid" : ""}
          appendTo="self"
          filter
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Dropdown
          id="cityGuid"
          name="cityGuid"
          value={formik.values.cityGuid}
          onChange={(e) => formik.setFieldValue("cityGuid", e.value)}
          options={allCityDef}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.city")}
          className={formik.touched.cityGuid && formik.errors.cityGuid ? "p-invalid" : ""}
          disabled={!formik.values.countryGuid}
          appendTo="self"
          filter
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Dropdown
          id="districtGuid"
          name="districtGuid"
          value={formik.values.districtGuid}
          onChange={(e) => formik.setFieldValue("districtGuid", e.value)}
          options={filteredDistricts}
          optionLabel="name"
          optionValue="guid"
          placeholder={t("memberMerchantApplication.district")}
          className={formik.touched.districtGuid && formik.errors.districtGuid ? "p-invalid" : ""}
          disabled={!formik.values.cityGuid}
          appendTo="self"
          filter
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.postalCode")}
          type="text"
          id="postalCode"
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          isInvalid={formik.touched.postalCode && formik.errors.postalCode}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.neighborhood")}
          type="text"
          id="neighborhood"
          name="neighborhood"
          value={formik.values.neighborhood}
          onChange={formik.handleChange}
          isInvalid={formik.touched.neighborhood && formik.errors.neighborhood}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.addressline1")}
          type="text"
          id="addressline1"
          name="addressline1"
          value={formik.values.addressline1}
          onChange={formik.handleChange}
          isInvalid={formik.touched.addressline1 && formik.errors.addressline1}
        />
      </Form.Group>
      <Form.Group className="form-item">
        <Form.Control
          placeholder={t("memberMerchantApplication.addressline2")}
          type="text"
          id="addressline2"
          name="addressline2"
          value={formik.values.addressline2}
          onChange={formik.handleChange}
          isInvalid={formik.touched.addressline2 && formik.errors.addressline2}
        />
      </Form.Group>
      <Form.Group className="form-item w-100">
        <Form.Control
          placeholder={t("memberMerchantApplication.addressline3")}
          type="text"
          id="addressline3"
          name="addressline3"
          value={formik.values.addressline3}
          onChange={formik.handleChange}
          isInvalid={formik.touched.addressline3 && formik.errors.addressline3}
        />
      </Form.Group>
    </div>
  );
}

