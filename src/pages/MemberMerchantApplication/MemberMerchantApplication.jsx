import { useEffect, useState, useRef, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  submitMemberMerchantApplication,
  clearApplicationState,
  setApplicationError,
} from "../../store/slices/memberMerchantApplication/memberMerchantApplicationSlice";
import { updateUser } from "../../store/slices/login/authSlice";

import { Message } from "primereact/message";

import errorIcon from "@/assets/images/alerts/error.svg";
import { getErrorMessage, formatDateForAPI } from "@/utils/helpers.jsx";
import Step1 from "./FormSteps/Step1";
import Step2 from "./FormSteps/Step2";
import Step3 from "./FormSteps/Step3";
import Step4 from "./FormSteps/Step4";
import { ProgressSpinner } from "primereact/progressspinner";

export default function MemberMerchantApplication() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const stepValidators = useRef({});

  const { loading, error, success } = useSelector(
    (state) => state.memberMerchantApplication
  );

  const { allDocumentTypes, allCityDef, allDistrictDef } = useSelector((state) => state.selectOptions);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setApplicationError(null));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearApplicationState());
    };
  }, []);

  const validationSchema = useMemo(() => {
    const schemaShape = {
      contactName: Yup.string().required(t("errors.required")),
      contactSurname: Yup.string().required(t("errors.required")),
      contactEmail: Yup.string().email(t("errors.invalidEmail")).required(t("errors.required")),
      contactPhoneNumber: Yup.string()
        .required(t("errors.required"))
        .matches(/^[1-9]\d{9}$/, t("errors.phoneStartsWithZero")),
      // ownerIdentityNumber: Yup.string()
      //   .required(t("errors.required"))
      //   .matches(/^\d{11}$/, t("errors.invalidIdentityNumber")),
      contactDateOfBirth: Yup.date().required(t("errors.required")),
      
      companyTypeGuid: Yup.string().required(t("errors.required")),
      // taxOffice: Yup.string().required(t("errors.required")),
      taxNumber: Yup.string()
        .required(t("errors.required"))
        .matches(/^\d+$/, t("errors.onlyNumbers"))
        .min(10, t("errors.minLength", { length: 10 })),
      companyName: Yup.string()
        .required(t("errors.required"))
        .min(3, t("errors.minLength", { length: 3 })),
      commercialName: Yup.string()
        .required(t("errors.required"))
        .min(3, t("errors.minLength", { length: 3 })),
      // tradeRegisterNumber: Yup.string().required(t("errors.required")),
      mccGuid: Yup.string().required(t("errors.required")),
      countryGuid: Yup.string().required(t("errors.required")),
      cityGuid: Yup.string().required(t("errors.required")),
      districtGuid: Yup.string().required(t("errors.required")),
      postalCode: Yup.string().required(t("errors.required")),
      // neighborhood: Yup.string().required(t("errors.required")),
      // addressline1: Yup.string().required(t("errors.required")),
      // addressline2: Yup.string(),
      // addressline3: Yup.string(),
      
      paymentMethodGuid: Yup.string().required(t("errors.required")),
      webUrl: Yup.string().required(t("errors.required")),
    };

    const activeDocumentTypes = (allDocumentTypes || []).filter((doc) => doc.isActive);
    activeDocumentTypes.forEach((docType) => {
      const fieldName = `document_${docType.guid}`;
      if (docType.isRequired) {
        schemaShape[fieldName] = Yup.array()
          .min(1, t("errors.required"))
          .required(t("errors.required"))
          .nullable();
      } else {
        schemaShape[fieldName] = Yup.array().nullable();
      }
    });

    return Yup.object().shape(schemaShape);
  }, [allDocumentTypes, t]);

  const getInitialValues = useMemo(() => {
    const baseValues = {
      contactName: "",
      contactSurname: "",
      contactEmail: "",
      contactPhoneNumber: "",
      ownerIdentityNumber: "",
      contactDateOfBirth: null,

      companyTypeGuid: null,
      taxOffice: "",
      taxNumber: "",
      companyName: "",
      commercialName: "",
      tradeRegisterNumber: "",
      mccGuid: null,
      countryGuid: null,
      cityGuid: null,
      districtGuid: null,
      postalCode: "",
      neighborhood: "",
      addressline1: "",
      addressline2: "",
      addressline3: "",
      
      paymentMethodGuid: null,
      webUrl: "",
    };

    const activeDocumentTypes = (allDocumentTypes || []).filter((doc) => doc.isActive);
    activeDocumentTypes.forEach((docType) => {
      const fieldName = `document_${docType.guid}`;
      baseValues[fieldName] = [];
    });

    return baseValues;
  }, [allDocumentTypes]);

  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema,
    onSubmit: async (values) => {
      const uploadDocumentList = [];
      const fileMap = new Map();
      
      Object.keys(values).forEach((key) => {
        if (key.startsWith('document_')) {
          const documentGuid = parseInt(key.replace('document_', ''));
          const files = values[key];
          if (files && Array.isArray(files) && files.length > 0) {
            files.forEach((file) => {
              const listIndex = uploadDocumentList.length;
              uploadDocumentList.push({
                DocumentType: documentGuid,
              });
              // File objesini sakla
              fileMap.set(listIndex, file);
            });
          }
        }
      });

      // City ve District name'lerini bul
      const selectedCity = allCityDef.find(city => city.guid === values.cityGuid);
      const selectedDistrict = allDistrictDef.find(district => district.guid === values.districtGuid);

      const formattedValues = {
        ...values,
        contactDateOfBirth: formatDateForAPI(values.contactDateOfBirth),
        UploadDocumentList: uploadDocumentList,
        _fileMap: fileMap,
        UserData: user?.userName || '',
        CityName: selectedCity?.cityName || '',
        DistrictName: selectedDistrict?.districtName || '',
      };

      Object.keys(formattedValues).forEach((key) => {
        if (key.startsWith('document_')) {
          delete formattedValues[key];
        }
      });

      dispatch(submitMemberMerchantApplication(formattedValues))
        .unwrap()
        .then((response) => {
          toast.success(t("memberMerchantApplication.success"));
          
          // User bilgilerini güncelle
          const updatedUserData = {
            isBoarding: true,
            onBoardingStatus: "Basvuru Degerlendirme",
            onBoardingSubStatus: "Basvuru Iletildi",
          };
          
          // Redux store'daki user bilgilerini güncelle
          dispatch(updateUser(updatedUserData));
        })
        .catch((error) => {
          dispatch(setApplicationError(error));
          toast.error(error);
        });
    },
  });

  const handleStepValidate = (stepIndex, validateFn) => {
    stepValidators.current[stepIndex] = validateFn;
  };

  const handleNextStep = async () => {
    const validateFn = stepValidators.current[activeStepIndex];
    if (validateFn && typeof validateFn === "function") {
      const isValid = await validateFn();
      if (isValid) {
        setActiveStepIndex(activeStepIndex + 1);
      }
    } else {
      // Validator yoksa direkt geç
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      {error && (
        <Message
          severity="error"
          className="d-flex justify-content-start gap-1 mb-4"
          content={
            <>
              <img src={errorIcon} alt="error" />
              <div>
                <b>{t("common.error")}: </b>
                {error}
              </div>
            </>
          }
        />
      )}
      {getErrorMessage(formik) && (
        <Message
          severity="error"
          className="d-flex justify-content-start gap-1 mb-4"
          content={
            <>
              <img src={errorIcon} alt="error" />
              <div>
                <b>{t("common.error")}: </b>
                {getErrorMessage(formik)}
              </div>
            </>
          }
        />
      )}
      {loading ? (
        <ProgressSpinner className="custom-page-proggress" />
      ) : (
        <>
          <div className="form-title mb-2">{t("memberMerchantApplication.title")}</div>
          <div className="form-subtitle mb-3">{t("memberMerchantApplication.subtitle")}</div>
          <div className="form-content-box">
            {activeStepIndex === 1 && (
              <Step1
                formik={formik}
                onValidate={(validateFn) => handleStepValidate(1, validateFn)}
              />
            )}
            {activeStepIndex === 2 && (
              <Step2
                formik={formik}
                onValidate={(validateFn) => handleStepValidate(2, validateFn)}
              />
            )}
            {activeStepIndex === 3 && (
              <>
                <Step3
                  formik={formik}
                  onValidate={(validateFn) => handleStepValidate(3, validateFn)}
                />
              </>
            )}
            {activeStepIndex === 4 && (
              <Step4
                formik={formik}
                onValidate={(validateFn) => handleStepValidate(4, validateFn)}
              />
            )}
          </div>
          <div className="button-wrapper">
            {activeStepIndex !== 1 && (
              <div className="step-button" onClick={() => setActiveStepIndex(activeStepIndex - 1)}>
                <i className="pi pi-arrow-left"></i>
                <span>{t("Geri")}</span>
              </div>
            )}
            {activeStepIndex < 4 ? (
              <div className="step-button" onClick={handleNextStep}>
                <span>{t("common.continue")}</span>
                <i className="pi pi-arrow-right"></i>
              </div>
            ) : (
              <Button type="submit" className="step-button" disabled={loading}>
                <span>{t("memberMerchantApplication.completeApplication")}</span>
                <i className="pi pi-check"></i>
              </Button>
            )}
          </div>
        </>
      )}
    </Form>
  );
}