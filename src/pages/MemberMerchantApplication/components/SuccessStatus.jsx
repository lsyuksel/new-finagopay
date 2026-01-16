import { useTranslation } from "react-i18next";
import successIcon from "@/assets/images/alerts/success.svg";

export default function SuccessStatus({ onBoardingSubStatus }) {
    const { t } = useTranslation();

    return (
        <div className="auth-form-area">
            <div className="forgot-password-container">
                <div className="process-result-container">
                    <div className="title">{t("memberMerchantApplication.applicationCurrentlyTitle1")}</div>
                    <div className="icon"><img src={successIcon} /></div>
                    <div className="result-text success-color">{onBoardingSubStatus}</div>
                    <div className='text-content mb-0' dangerouslySetInnerHTML={{ __html: t("memberMerchantApplication.applicationCurrentlyText1") }} />
                </div>
            </div>
        </div>
    );
}

