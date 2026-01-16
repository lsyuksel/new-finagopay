import React, { useCallback, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FileUpload } from "primereact/fileupload";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentTypes } from "../../../store/slices/selectOptionSlice";
import fileUploadIcon from "@/assets/images/icons/fileUploadIcon.svg";
import { setApplicationError } from "../../../store/slices/memberMerchantApplication/memberMerchantApplicationSlice";

export default function Step3({ formik, onValidate }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const { allDocumentTypes } = useSelector((state) => state.selectOptions);

  // API çağrısını yap
  useEffect(() => {
    dispatch(getDocumentTypes());
  }, [dispatch]);

  // Aktif döküman tiplerini filtrele
  const activeDocumentTypes = allDocumentTypes.filter((doc) => doc.isActive);

  // Dosya yükleme handler'ı
  const handleFileUpload = (documentGuid, files) => {
    const file = files[0]; // Sadece ilk dosyayı al
    const fieldName = `document_${documentGuid}`;
    formik.setFieldValue(fieldName, [file]); // Direkt File objesi olarak sakla
  };

  // Dosya silme handler'ı
  const handleFileRemove = (documentGuid) => {
    const fieldName = `document_${documentGuid}`;
    formik.setFieldValue(fieldName, []);
  };

  const validateStep = useCallback(async () => {
    const errors = await formik.validateForm();
    
    // Zorunlu dökümanları kontrol et
    const requiredDocs = activeDocumentTypes.filter((doc) => doc.isRequired);
    const missingDocs = requiredDocs.filter((doc) => {
      const fieldName = `document_${doc.guid}`;
      const files = formik.values[fieldName];
      return !files || files.length === 0;
    });

    if (missingDocs.length > 0) {
      missingDocs.forEach((doc) => {
        const fieldName = `document_${doc.guid}`;
        formik.setFieldTouched(fieldName, true);
        formik.setFieldError(fieldName, t("errors.required"));
      });
      return false;
    }

    // Formik hatalarını kontrol et
    const documentFields = activeDocumentTypes.map((doc) => `document_${doc.guid}`);
    const hasErrors = documentFields.some((field) => errors[field]);
    
    return !hasErrors;
  }, [formik, activeDocumentTypes, t]);

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
      {activeDocumentTypes.map((docType) => {
        const fieldName = `document_${docType.guid}`;
        const files = formik.values[fieldName] || [];
        const isRequired = docType.isRequired;
        const hasFile = files.length > 0;

        return (
          <Form.Group key={docType.guid} className="form-item w-100">
            <div className="file-upload-container">
              <div className="file-upload-header">
                <div className="file-upload-title">{docType.name}{isRequired && <span className="required-indicator">*</span>}</div>
                <div className="file-upload-description">
                  <i className="pi pi-info-circle"></i>
                  <span>{docType.description}</span>
                </div>
              </div>
              {files.length > 0 ? (
                <div className="uploaded-files-list">
                  {files.map((file, index) => (
                    <div key={index} className="uploaded-file-item">
                      <span>{file.name || file.fileName}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => handleFileRemove(docType.guid)}>
                        <i className="pi pi-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="file-upload-placeholder">
                    <i className="pi pi-upload"></i>
                    <span>{t("common.fileUpload")}</span>
                  </div>
                  <FileUpload
                    id={fieldName}
                    name={fieldName}
                    mode="basic"
                    accept="image/*,.pdf"
                    chooseLabel={t("common.fileUpload")}
                    maxFileSize={5000000}
                    onSelect={(e) => handleFileUpload(docType.guid, e.files)}
                  />
                </>
              )}
            </div>
          </Form.Group>
        );
      })}
    </div>
  );
}
