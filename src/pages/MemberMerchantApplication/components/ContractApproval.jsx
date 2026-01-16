import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { getMerchantAgreementForApproval, approveMerchantAgreement, getUserCanApproveAgreement } from "@/store/slices/merchantAgreement/merchantAgreementSlice";
import { updateUser } from "@/store/slices/login/authSlice";
import errorIcon from "@/assets/images/alerts/error.svg";
import { useNavigate } from "react-router-dom";

export default function ContractApproval({ onBoardingSubStatus }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { agreements, agreementsLoading, agreementsError, approvalLoading, approvalError, approvalSuccess, canApproveAgreement, canApproveLoading, canApproveError } = useSelector(
        (state) => state.merchantAgreement
    );
    const { user } = useSelector((state) => state.auth);
    
    const [selectedAgreements, setSelectedAgreements] = useState([]);
    const [visibleDialogs, setVisibleDialogs] = useState({});
    
    useEffect(() => {
        if (user?.userName) {
            dispatch(getUserCanApproveAgreement(user.userName));
        }
    }, [dispatch, user?.userName]);

    useEffect(() => {
        if (canApproveAgreement === true) {
            dispatch(getMerchantAgreementForApproval());
        }
    }, [dispatch, canApproveAgreement, approvalLoading]);

    // Sözleşme indirme işlevi
    const handleDownloadAgreement = (agreement) => {
        // HTML içeriğini blob olarak indir
        const blob = new Blob([agreement.agreementContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${agreement.name || 'sozlesme'}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    // Modal açma/kapama
    const handleOpenDialog = (guid) => {
        setVisibleDialogs((prev) => ({
            ...prev,
            [guid]: true,
        }));
    };

    const handleCloseDialog = (guid) => {
        setVisibleDialogs((prev) => ({
            ...prev,
            [guid]: false,
        }));
    };

    // Toggle switch değişikliği
    const handleAgreementToggle = (guid, value) => {
        if (value) {
            setSelectedAgreements((prev) => [...prev, guid]);
        } else {
            setSelectedAgreements((prev) => prev.filter((g) => g !== guid));
        }
    };

    // Sözleşme metnini render et (linkli metin için)
    const renderAgreementText = (item) => {
        if (!item.linkedText || !item.description) {
            return item.description || item.name;
        }
        
        const parts = item.description.split(item.linkedText);
        return (
            <>
                {parts[0]}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleOpenDialog(item.guid);
                    }}
                    className="text-link"
                >
                    {item.linkedText}
                </a>
                {parts[1]}
            </>
        );
    };

    // Başvuruyu tamamla
    const handleCompleteApplication = () => {
        // Tüm sözleşmeler onaylandı mı kontrol et
        const allApproved = agreements?.every((agreement) => 
            selectedAgreements.includes(agreement.guid)
        );

        if (!allApproved) {
            toast.error(t("memberMerchantApplication.allAgreementsMustBeApproved"));
            return;
        }

        // Onaylama verilerini hazırla - API formatına uygun
        const approvalData = {
            userName: user?.userName || '',
            isAgreementApproved: true,
            merchantAgreements: agreements?.map((agreement) => ({
                guid: agreement.guid,
            })) || []
        };

        dispatch(approveMerchantAgreement(approvalData))
            .unwrap()
            .then((response) => {
                navigate("/");
                toast.success(t("memberMerchantApplication.agreementApprovalSuccess"));
            })
            .catch((error) => {
                toast.error(error || t("memberMerchantApplication.agreementApprovalError"));
            });
    };
    
    return (
        <>
            <div className="auth-form-area">
                <div className="forgot-password-container">
                    <div className="process-result-container">
                        <div className="title mb-2">{t("memberMerchantApplication.applicationCurrentlyTitle2")}</div>
                        <div className="subtitle mb-4">{t("memberMerchantApplication.applicationCurrentlySubTitle2")}</div>
                        
                        {(canApproveError || agreementsError || approvalError) && (
                            <Message
                                severity="error"
                                className="d-flex justify-content-start gap-1 mb-4"
                                content={
                                    <>
                                        <img src={errorIcon} alt="error" />
                                        <div>
                                            <b>{t("common.error")}: </b>
                                            {canApproveError || agreementsError || approvalError}
                                        </div>
                                    </>
                                }
                            />
                        )}
                        
                        {canApproveLoading || agreementsLoading ? (
                            <ProgressSpinner className="custom-page-proggress" style={{height: '200px'}} />
                        ) : canApproveAgreement === true ? (
                            agreements && agreements.length > 0 ? (
                            <>
                                {/* Sözleşme İndirme Listesi */}
                                <div className="agreement-download-list">
                                    {agreements.map((agreement, index) => (
                                        <div key={`download-${agreement.guid || index}`} className="agreement-item">
                                            <div className="item-content">
                                                <i className="fa-regular fa-file-lines"></i>
                                                <div className="">{agreement.name}</div>
                                            </div>
                                            <div className="item-button" onClick={() => handleDownloadAgreement(agreement)}>
                                                <i className="pi pi-cloud-download"></i>
                                                <span>{t("memberMerchantApplication.downloadAgreementDocument")}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Sözleşme Onay Listesi */}
                                <div className="agreement-approval-list">
                                    {agreements.map((agreement, index) => (
                                        <div key={`approval-${agreement.guid || index}`} className="agreement-item">
                                            <div className="d-flex align-items-center gap-2">
                                                <InputSwitch
                                                    inputId={`agreement_${agreement.guid}`}
                                                    checked={selectedAgreements.includes(agreement.guid)}
                                                    onChange={(e) => handleAgreementToggle(agreement.guid, e.value)}
                                                />
                                                <label 
                                                    htmlFor={`agreement_${agreement.guid}`} 
                                                    className="switch-link"
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {renderAgreementText(agreement)}
                                                </label>
                                            </div>

                                            <Dialog
                                                header={agreement.name}
                                                visible={visibleDialogs[agreement.guid] || false}
                                                style={{ width: "70vw" }}
                                                onHide={() => handleCloseDialog(agreement.guid)}
                                            >
                                                <div 
                                                    dangerouslySetInnerHTML={{ __html: agreement.agreementContent }} 
                                                    style={{ maxHeight: '70vh', overflowY: 'auto' }}
                                                />
                                            </Dialog>
                                        </div>
                                    ))}
                                </div>

                                {/* Başvuruyu Tamamla Butonu */}
                                <div className="text-center">
                                    <Button
                                        className="login-button"
                                        onClick={handleCompleteApplication}
                                        disabled={approvalLoading}
                                    >
                                        {approvalLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                {t("common.loading")}
                                            </>
                                        ) : (
                                            t("memberMerchantApplication.completeApplication")
                                        )}
                                    </Button>
                                </div>
                            </>
                            ) : (
                                <div className="text-center">{t("memberMerchantApplication.noAgreementFound")}</div>
                            )
                        ) : canApproveAgreement === false ? (
                            <>
                                {/* Sözleşme zaten onaylanmış - Başka template buraya gelecek */}
                                <div className="text-center text-success">
                                    <h4>{t('memberMerchantApplication.agreementAlreadyApproved')} {onBoardingSubStatus}</h4>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}

