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
            <div className={`dialog-flex-box ${type === 'success' ? 'success-color' : type === 'warning' ? 'warning-color' : type === 'danger2' ? 'custom-color' : 'danger-color'}`}>
                <i><img src={icon} alt="" /></i>
                <span>{message.title}</span>
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
                {errorCode && (<b>{t('messages.ErrorCode')} {errorCode}</b>)}
            </div>
        ),
        acceptClassName: type === 'success' ? 'success-color' : type === 'warning' ? 'warning-color' : type === 'danger2' ? 'custom-color' : 'danger-color',
        acceptLabel: type !== 'danger' && type !== 'danger2' ? t('common.ButtonComplete') : t('common.ButtonApprove'),
        accept: acceptCallback,
        
        rejectClassName: type !== 'danger' && type !== 'danger2' && 'd-none',
        rejectLabel: t('common.ButtonCancel'),
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

export const formatDateForAPI = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * String'in ilk harfini büyük yapar
 * @param {string} str - Dönüştürülecek string
 * @returns {string} İlk harfi büyük string
 */
export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Objeyi Form Data formatına (URLSearchParams) dönüştürür
 * @param {Object} data - Dönüştürülecek obje
 * @param {boolean} capitalizeKeys - Anahtarların ilk harfini büyük yap (varsayılan: true)
 * @returns {URLSearchParams} Form Data formatında veri
 */
export const objectToFormData = (data, capitalizeKeys = true) => {
    const formData = new URLSearchParams();
    
    Object.keys(data).forEach((key) => {
        const finalKey = capitalizeKeys ? capitalizeFirst(key) : key;
        const value = data[key];
        
        // UploadDocumentList array ise özel işleme
        if (key === 'UploadDocumentList' && Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item.File) {
                    formData.append(`UploadDocumentList[${index}].File`, item.File);
                }
                if (item.DocumentType !== undefined) {
                    formData.append(`UploadDocumentList[${index}].DocumentType`, item.DocumentType);
                }
            });
            return;
        }
        
        // Null veya undefined değerleri boş string olarak ekle
        formData.append(finalKey, value !== null && value !== undefined ? value : '');
    });
    
    return formData;
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
    const found = currencyDef?.find((item) => item.guid == Number(guid));
    return found ? found.alphabeticCode : null;
};
export const getCurrencyNumericName = (numericCode) => {
    const { currencyDef } = useSelector((state) => state.selectOptions);
    const found = currencyDef?.find((item) => item.numericCode == numericCode);
    return found ? found.alphabeticCode : null;
};

export const getAuthorizationResponseCode = (guid) => {
    const { allAuthorizationResponseCode } = useSelector((state) => state.selectOptions);
    const found = allAuthorizationResponseCode?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionType = (guid) => {
    const { allTransactionType } = useSelector((state) => state.selectOptions);
    const found = allTransactionType?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionNetwork = (guid) => {
    const { allTransactionNetwork } = useSelector((state) => state.selectOptions);
    const found = allTransactionNetwork?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getCardTypeName = (guid) => {
    const { allCardTypeName } = useSelector((state) => state.selectOptions);
    const found = allCardTypeName?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getProvisionStatus = (guid) => {
    const { allProvisionStatus } = useSelector((state) => state.selectOptions);
    const found = allProvisionStatus?.find((item) => item.guid == Number(guid));
    return found ? found.name : null;
};

export const getInstallmentType = (guid) => {
    const { allInstallmentType } = useSelector((state) => state.selectOptions);
    const found = allInstallmentType?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getPosEntryMode = (guid) => {
    const { allPosEntryMode } = useSelector((state) => state.selectOptions);
    const found = allPosEntryMode?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getBankName = (guid) => {
    const { allBankName } = useSelector((state) => state.selectOptions);
    const found = allBankName?.find((item) => item.guid == Number(guid));
    return found ? found.bankName : null;
};

export const getSecurityLevelIndicator = (guid) => {
    const { allSecurityLevelIndicator } = useSelector((state) => state.selectOptions);
    const found = allSecurityLevelIndicator?.find((item) => item.guid == Number(guid));
    return found ? found.description : null;
};

export const getTransactionCurrency = (numericCode) => {
    const { currencyDef } = useSelector((state) => state.selectOptions);
    const found = currencyDef?.find((item) => item.numericCode == Number(numericCode));
    return found ? found.currencyName : null;
};

export const priceFormat = (price) => {
    if (price === null || price === undefined || price === '') return '';
    
    // Sayıyı parse et
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : Number(price);
    
    // Geçerli bir sayı değilse boş string döndür
    if (isNaN(numPrice)) return '';
    
    // Sayıyı string'e çevir ve ondalık kısmını ayır
    const parts = numPrice.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';
    
    // Binlik ayırıcı olarak nokta ekle
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Ondalık kısım varsa virgül ile birleştir
    if (decimalPart) {
        return `${formattedInteger},${decimalPart}`;
    }
    
    return formattedInteger;
};

/**
 * API error response'undan hata mesajını çıkarır
 * @param {Error} error - Axios error objesi
 * @param {string} defaultMessage - Varsayılan hata mesajı (opsiyonel)
 * @returns {string} Hata mesajı
 */
export const getApiErrorMessage = (error, defaultMessage = null) => {
    const fallbackMessage = defaultMessage || t("messages.error");
    
    if (error.response?.data) {
        try {
            const parsedError = typeof error.response.data === 'string' 
                ? JSON.parse(error.response.data) 
                : error.response.data;
            
            return parsedError?.Message || fallbackMessage;
        } catch {
            return error.response.data || fallbackMessage;
        }
    } else if (error.message) {
        return error.message;
    }
    
    return fallbackMessage;
};