import { t } from "i18next";
import { confirmDialog } from "primereact/confirmdialog";
import { useDispatch, useSelector } from "react-redux";

export const getErrorMessage = (formik) => {
    const fields = Object.keys(formik.errors);
    for (const field of fields) {
        if (formik.touched[field] && formik.errors[field]) {
            return formik.errors[field];
        }
    }
    return null;
}; 

export const showDialog = (type, message, icon, errorCode, acceptCallback) => {
    const dialogConfig = {
        group: 'ConfirmDialogTemplating',
        message: (
            <div className={`dialog-flex-box ${type === 'success' ? 'success-color' : type === 'warning' ? 'warning-color' : 'danger-color'}`}>
                <i><img src={icon} alt="" /></i>
                <span>{message.title}</span>
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
                {errorCode && (<b>{t('messages.ErrorCode')} {errorCode}</b>)}
            </div>
        ),
        acceptClassName: type === 'success' ? 'success-color' : type === 'warning' ? 'warning-color' : 'danger-color',
        acceptLabel: type === 'success' ? t('common.ButtonComplete') : t('common.ButtonApprove'),
        accept: acceptCallback,
        rejectClassName: type !== 'danger' && 'd-none',
        rejectLabel: type === 'danger' && t('common.ButtonCancel'),
        reject: type === 'success' ? null : () => {},
    };

    confirmDialog(dialogConfig);
};

export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Tarih formatı: GG-AA-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    // Saat formatı: SS:DD
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const getDateRange = (filter) => {
    const now = new Date();
    const startDate = new Date();
    
    switch(filter) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        return { startDate, endDate: now };
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        return { startDate, endDate };
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        return { startDate, endDate: now };
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        return { startDate, endDate: now };
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        return { startDate, endDate: now };
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        return { startDate, endDate: now };
      default:
        startDate.setMonth(startDate.getMonth() - 12);
        return { startDate, endDate: now };
    }
};

export const getCurrencyName = (guid) => {
    const { currencyDef } = useSelector((state) => state.selectOptions);
    const found = currencyDef.find((item) => item.guid == Number(guid));
    return found ? found.alphabeticCode : null;
};

export const getAuthorizationResponseCode = (guid) => {
    const { allAuthorizationResponseCode } = useSelector((state) => state.selectOptions);
    const found = allAuthorizationResponseCode.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionType = (guid) => {
    const { allTransactionType } = useSelector((state) => state.selectOptions);
    const found = allTransactionType.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionNetwork = (guid) => {
    const { allTransactionNetwork } = useSelector((state) => state.selectOptions);
    const found = allTransactionNetwork.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getCardTypeName = (guid) => {
    const { allCardTypeName } = useSelector((state) => state.selectOptions);
    const found = allCardTypeName.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getProvisionStatus = (guid) => {
    const { allProvisionStatus } = useSelector((state) => state.selectOptions);
    const found = allProvisionStatus.find((item) => item.guid == Number(guid));
    return found ? found.name : null;
};

export const getInstallmentType = (guid) => {
    const { allInstallmentType } = useSelector((state) => state.selectOptions);
    const found = allInstallmentType.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getPosEntryMode = (guid) => {
    const { allPosEntryMode } = useSelector((state) => state.selectOptions);
    const found = allPosEntryMode.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getBankName = (guid) => {
    const { allBankName } = useSelector((state) => state.selectOptions);
    const found = allBankName.find((item) => item.guid == Number(guid));
    return found ? found.bankName : null;
};

export const getCardAcceptorCountry = (numericCode) => {
    const { allCardAcceptorCountry } = useSelector((state) => state.selectOptions);
    const found = allCardAcceptorCountry.find((item) => item.numericCode == Number(numericCode));
    return found ? found.countryName : "getCardAcceptorCountry calısmıyorr";
};

export const getSecurityLevelIndicator = (guid) => {
    const { allSecurityLevelIndicator } = useSelector((state) => state.selectOptions);
    const found = allSecurityLevelIndicator.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionCurrency = (numericCode) => {
    const { currencyDef } = useSelector((state) => state.selectOptions);
    const found = currencyDef.find((item) => item.numericCode == Number(numericCode));
    return found ? found.currencyName : null;
};