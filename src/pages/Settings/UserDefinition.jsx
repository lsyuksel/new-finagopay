import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordProfile, changePasswordProfileVerify, getMerchantProfileActivityLog, getProfile, setUserDefinitionError } from '../../store/slices/settings/userDefinitionSlice';

import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Password } from "primereact/password";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import AuthCode from "react-auth-code-input";
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import activityLogIcon from '@assets/images/icons/activity-log.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '../../utils/helpers';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';

export default function UserDefinition() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const { loading, error, success, profileData, activityLogData } = useSelector((state) => state.userDefinition);

  const [otpDialogVisible, setOtpDialogVisible] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    dispatch(getProfile({
      merchantId: `${authData.merchantId}`,
      userGuid: authData.user.guid,
    }));
    dispatch(getMerchantProfileActivityLog({
      merchantId: `${authData.merchantId}`,
      userGuid: authData.user.guid,
    }));
  }, [])

  // useEffect(() => {
  //   if(profileData) {
  //     console.log("profileData", profileData);
  //   }
  //   if(activityLogData) {
  //     console.log("profileData activityLogData", profileData);
  //   }
  // }, [profileData, activityLogData])

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required(t("errors.required")),
    password: Yup.string()
      .min(8, t("errors.passwordMinLength"))
      .matches(/[a-z]/, t("errors.passwordLowercase"))
      .matches(/[A-Z]/, t("errors.passwordUppercase"))
      .matches(/[0-9]/, t("errors.passwordNumber"))
      .matches(/[?@!#%+\-*%]/, t("errors.passwordSpecialChar"))
      .required(t("errors.required")),
    passwordAgain: Yup.string()
      .oneOf([Yup.ref("password")], t("errors.passwordsMustMatch"))
      .required(t("errors.required")),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      passwordAgain: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(changePasswordProfile({
        merchantId: `${authData.merchantId}`,
        userGuid: authData.user.guid,
        oldPassword: values.oldPassword,
        newPassword: values.password,
        confirmPassword: values.password
      }))
        .unwrap()
        .then(() => {
          setOtpDialogVisible(true);
          formik.resetForm();
        })
        .catch((error) => {
          dispatch(setUserDefinitionError(error));
          toast.error(error);
        });
    },
  });

  // Şifre kriterleri kontrol fonksiyonları
  const checkPasswordCriteria = (password) => {
    const criteria = {
      minLength: password.length >= 8,
      hasNumberAndSpecial: /[0-9]/.test(password) && /[?@!#%+\-*%]/.test(password),
      hasUpperAndLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    };
    return criteria;
  };

  const passwordCriteria = checkPasswordCriteria(formik.values.password);

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error(t("errors.invalidOtp"));
      return;
    }

    const currentDateTime = new Date().toISOString();
    dispatch(changePasswordProfileVerify({
      merchantId: `${authData.merchantId}`,
      userGuid: authData.user.guid,
      verificationCode: otpCode,
      otpDatetime: currentDateTime,
    }))
    .unwrap()
    .then(() => {
      toast.success(t("messages.success"));
      setOtpDialogVisible(false);
      setOtpCode("");
    })
    .catch((error) => {
      dispatch(setUserDefinitionError(error));
      toast.error(error);
    });
  };

  const activityLogHeader = (
      <div className="title">
          <img src={activityLogIcon} alt="" />
          <span>{t("settings.activityHistoryTitle")}</span>
      </div>
  );

  const activityLogColumns = [
      { field: 'loginDateTime', header: t('transactionDetail.tableTitle6'), className: "", body: (rowData) => formatDate(rowData.loginDateTime) },
      { field: 'userGuid', header: t('settings.userGuid'), className: "" },
      { field: 'ipAddress', header: t('settings.ipAddress'), className: "" },
      // { field: 'status', header: t('settings.status'), className: "" },
      { 
          field: 'status', 
          header: t('settings.status'), 
          body: (rowData) => (
              rowData.status === 'Success Login' ? <Tag severity="success" value="Başarılı"></Tag> : <Tag severity="waiting" value="Başarısız"></Tag>
          )
      },
  ];
  
  return (
    <div className="settings-container">
      <div className="back-button" onClick={()=>navigate('/')}>
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.3871 0.209705L4.29289 0.292893L0.292893 4.29289C-0.0675907 4.65338 -0.0953203 5.22061 0.209705 5.6129L0.292893 5.70711L4.29289 9.70711C4.68342 10.0976 5.31658 10.0976 5.70711 9.70711C6.06759 9.34662 6.09532 8.77939 5.7903 8.3871L5.70711 8.29289L3.414 5.999L12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4L3.416 3.999L5.70711 1.70711C6.06759 1.34662 6.09532 0.779392 5.7903 0.387101L5.70711 0.292893C5.34662 -0.0675907 4.77939 -0.0953203 4.3871 0.209705Z" fill="#8200BA"/>
        </svg>
        <span>{ t('settings.returnHome') }</span>
      </div>
      <div className="title">{ t('settings.userdefinitionTitle') }</div>
      <div className="profile-box">
        
        <div className="profile-top-box">
          <div className="item">
            <div className="title">{ t('settings.userdefinitionName') }</div>
            <div className="text">{ profileData?.firstName + ' ' + profileData?.lastName }</div>
            <div className="subtext">
              <b>{ t('settings.userdefinitionMerchantId') }: </b>
              <span>{ profileData?.merchantId }</span>
            </div>
          </div>
          <div className="item">
            <div className="title">{ t('settings.userdefinitionPhone') }</div>
            <div className="text">{ profileData?.phone }</div>
          </div>
          <div className="item">
            <div className="title">{ t('settings.userdefinitionEmail') }</div>
            <div className="text">{ profileData?.email }</div>
          </div>
        </div>
        <div className="password-change-box">
          <div className="title">{ t('settings.userdefinitionPasswordTitle') }</div>
          <Form onSubmit={formik.handleSubmit}>
            <div className="password-input-wrapper">
              <Form.Group className="form-item">
                <div className="label">{ t('settings.userdefinitionPasswordOld') }</div>
                <Password
                  className="p-form-control"
                  id="oldPassword"
                  name="oldPassword"
                  placeholder={t("settings.userdefinitionPasswordOldPlaceholder")}
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.oldPassword && formik.errors.oldPassword}
                  feedback={false}
                  tabIndex={1}
                  toggleMask
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <div className="error-message text-start">{formik.errors.oldPassword}</div>
                )}
              </Form.Group>
              <Form.Group className="form-item">
                <div className="label">{ t('settings.userdefinitionPassword') }</div>
                <Password
                  className="p-form-control"
                  id="password"
                  name="password"
                  placeholder={t("settings.userdefinitionPasswordPlaceholder")}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.password && formik.errors.password}
                  feedback={false}
                  tabIndex={2}
                  toggleMask
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error-message text-start">{formik.errors.password}</div>
                )}
              </Form.Group>
              <Form.Group className="form-item">
                <div className="label">{ t('settings.userdefinitionPasswordAgain') }</div>
                <Password
                  className="p-form-control"
                  id="passwordAgain"
                  name="passwordAgain"
                  placeholder={t("settings.userdefinitionPasswordAgainPlaceholder")}
                  value={formik.values.passwordAgain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.passwordAgain && formik.errors.passwordAgain}
                  feedback={false}
                  tabIndex={3}
                  toggleMask
                />
                {formik.touched.passwordAgain && formik.errors.passwordAgain && (
                  <div className="error-message text-start">{formik.errors.passwordAgain}</div>
                )}
              </Form.Group>
              <div className="button-wrapper">
                <div className="label"></div>
                <button 
                  type="submit" 
                  className="button primary-button"
                  onClick={formik.handleSubmit}
                >
                  <span>{t('settings.userdefinitionUpdateButton')}</span>
                </button>
              </div>
            </div>
            {formik.values.password && formik.values.password.length > 0 && (
              <div className="password-criteria">
                <div className="criteria-title">{ t('settings.userdefinitionPasswordCriteriaTitle') }</div>
                <ul className="criteria-list">
                  <li className={passwordCriteria.minLength ? 'criteria-valid' : 'criteria-invalid'}>
                    { t('settings.userdefinitionPasswordCriteria1') }
                  </li>
                  <li className={passwordCriteria.hasNumberAndSpecial ? 'criteria-valid' : 'criteria-invalid'}>
                    { t('settings.userdefinitionPasswordCriteria2') }
                  </li>
                  <li className={passwordCriteria.hasUpperAndLower ? 'criteria-valid' : 'criteria-invalid'}>
                    { t('settings.userdefinitionPasswordCriteria3') }
                  </li>
                </ul>
              </div>
            )}
          </Form>
        </div>
      </div>
      <Dialog
        className='filter-modal-dialog'
        visible={otpDialogVisible}
        style={{ width: '30vw', minWidth: 400 }}
        onHide={() => {
          setOtpDialogVisible(false);
          setOtpCode("");
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button label={t('common.save')} onClick={handleOtpSubmit} className="filter-button mx-0" disabled={!otpCode || otpCode.length !== 6} autoFocus />
          </div>
        }
        modal
      >
        <div className="title-area">
          <div className="title">{t('common.otpVerification')} </div>
          <div className="subtitle">{t('common.otpInstructions')} </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <Form.Group className="form-item">
            <AuthCode
              onChange={(res) => setOtpCode(res)}
              length={6}
              inputClassName="form-control otp-input"
              containerClassName="otp-input-container"
            />
          </Form.Group>
        </div>
      </Dialog>
      <div className="log-table-box">
          <div className='detail-table-section'>
              { !loading ? (
                <div className="datatable-area-container detail-page-table">
                    <DataTable 
                        header={activityLogHeader}
                        value={activityLogData || []} 
                        emptyMessage={t('common.recordEmptyMessage')}
                        currentPageReportTemplate={t('common.paginateText')}
                        scrollable
                    >
                        {activityLogColumns.map((col, index) => (
                            <Column 
                                className='center-column'
                                key={index} 
                                {...col} 
                                style={{ 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            />
                        ))}
                    </DataTable>
                </div>
              ) : (
              <div className="custom-table-progress-spinner">
                <ProgressSpinner />
              </div>
              )}
          </div>
      </div>
    </div>
  )
}