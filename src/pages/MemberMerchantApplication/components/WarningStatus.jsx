export default function WarningStatus({ onBoardingStatus, onBoardingSubStatus }) {
    return (
        <div className="auth-form-area">
            <div className="forgot-password-container">
                <div className="process-result-container">
                    <div className="title">{onBoardingStatus || ''}</div>
                    <div className="icon warning-color"><i className="pi pi-exclamation-circle"></i></div>
                    <div className="result-text warning-color mb-0">{onBoardingSubStatus}</div>
                    {/* <div className='text-content' dangerouslySetInnerHTML={{ __html: t("memberMerchantApplication.applicationCurrentlyText1") }} /> */}
                </div>
            </div>
        </div>
    );
}

