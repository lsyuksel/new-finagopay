import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Password } from "primereact/password";
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import activityLogIcon from '@assets/images/icons/activity-log.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate } from '../../utils/helpers';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import { merchantGetKeys, merchantGetProfile, merchantUpdateKeys } from '../../store/slices/settings/keyDefinitionSlice';

const KeyDefinition = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const { loading, error, success, merchantProfile, merchantKeys } = useSelector((state) => state.keyDefinition);

  useEffect(() => {
    dispatch(merchantGetProfile(authData.merchantId));
    dispatch(merchantGetKeys(authData.merchantId));
  }, [])

  const updateMerchantKeys = () => {
    dispatch(merchantUpdateKeys({
      merchantId: `${authData.merchantId}`,
      apiSecret: "test_api_key_1",
      userGuid: authData.user.userName
    }))
    .unwrap()
    .then(() => {
      toast.success(t("messages.success"));
    })
    .catch((error) => {
      dispatch(setUserDefinitionError(error));
      toast.error(error);
    });
  }

  useEffect(() => {
    if(merchantProfile) {
      console.log("merchantProfile", merchantProfile);
    }
    if(merchantKeys) {
      console.log("merchantProfile merchantKeys", merchantKeys);
    }
  }, [merchantProfile, merchantKeys])

  return (
    <>
      <h4 className='m-0'>API Anahtarı :{ merchantKeys?.apiSecret }</h4>
      <h4>Güvenlik Anahtarı : { merchantKeys?.clientSecret }</h4>
      <button onClick={()=> updateMerchantKeys()}>Test Update Key</button>
    </>
  );
};

export default KeyDefinition; 