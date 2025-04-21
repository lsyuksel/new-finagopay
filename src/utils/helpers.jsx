import { t } from "i18next";
import { confirmDialog } from "primereact/confirmdialog";

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