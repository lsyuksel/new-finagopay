
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import smallLogo from '@assets/images/small-logo.png';

import paymentIcon1 from '@assets/images/icons/payment-system-1.svg';
import paymentIcon2 from '@assets/images/icons/payment-system-2.svg';
import paymentIcon3 from '@assets/images/icons/payment-system-3.svg';
import paymentIcon4 from '@assets/images/icons/payment-system-4.svg';

import refundIcon from '@assets/images/icons/icon-refund.svg';
import cancelIcon from '@assets/images/icons/icon-cancel.svg';

import successDialogIcon from '@assets/images/icons/successDialogIcon.svg'
import dangerDialogIcon from '@assets/images/icons/dangerDialogIcon.svg'
import danger2DialogIcon from '@assets/images/icons/refundDialogIcon.svg'

import warningDialogIcon from '@assets/images/icons/warningDialogIcon.svg'

import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { showDialog } from '@/utils/helpers';
import { toast } from 'react-toastify';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getTransactionDetail } from '../../../store/slices/transaction-managment/transactionDetailSlice';
import { formatDate } from '../../../utils/helpers';
import { cancelTransaction, refundTransaction } from '../../../store/slices/transaction-managment/transactionListSlice';

export default function DetailChargeback() {
    const { param } = useParams();
    const { t } = useTranslation();
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authData = useSelector((state) => state.auth);

    const { loading, error, success, transactionDetail } = useSelector((state) => state.transactionDetail);
    const [refundAmount, setRefundAmount] = useState('');

    const [availableAmount, setAvailableAmount] = useState();

    useEffect(() => {
        console.log("param",param)
        if(param) {
            dispatch(getTransactionDetail({
                merchantId: `${authData.merchantId}`,
                orderId: param
            }));
        }
    }, [])

    useEffect(() => {
        if (transactionDetail && transactionDetail.length > 0) {
            const amount = transactionDetail[0]?.refundableTotalAmount || 0;
            setAvailableAmount(amount);
        }
    }, [transactionDetail])


    const validateAmount = (amount) => {
        const numericAmount = amount;

        if (isNaN(numericAmount)) {
            toast.error(t('errors.invalidAmount'));
            return false;
        }
        if (numericAmount <= 0) {
            toast.error(t('errors.amountGreaterThanZero'));
            return false;
        }
        if (numericAmount > availableAmount) {
            toast.error(t('errors.amountExceedsAvailable', { available: availableAmount }));
            return false;
        }
        return true;
    };

    const handleRefund = () => {
        if (validateAmount(refundAmount)) {
            confirmRefundDialog(refundAmount)
        }
    };

    const handleCancel = () => {
        if (validateAmount(refundAmount)) {
            confirmCancelDialog(refundAmount)
        }
    };

        
    const header1 = (
        <>
            <div className="title">
                <img src={paymentIcon1} alt="" />
                <span>{t("transactionDetail.sectionTitle1")}</span>
            </div>
            <div className="text">{t("transactionDetail.sectionText1")}</div>
        </>
    );

    const columns1 = [
        { field: 'orderId', header: t('transactionDetail.tableTitle1'), className: "", },
        { 
            field: 'paymentMethod', 
            header: t('transactionDetail.tableTitle2'), 
            body: (rowData) => (
              <div className="logos-text justify-content-center">
                <i><img src={smallLogo} /></i>
                <span>{rowData.paymentMethod}</span>
              </div>
            )
        },
        { field: 'f043CardAcceptorName', header: t('transactionDetail.tableTitle3'), className: "", },
        { field: 'amount', header: t('transactionDetail.tableTitle4'), className: "price-column", },
        { 
            field: 'transactionStatusDesc', 
            header: t('transactionDetail.tableTitle5'), 
            body: (rowData) => (
                rowData.transactionStatusCode === '00' ? <Tag severity="success" value="Başarılı"></Tag> : <Tag severity="waiting" value="Başarısız"></Tag>
            )
        },
        { field: 'transactionDate', header: t('transactionDetail.tableTitle6'), className: "", body: (rowData) => formatDate(rowData.transactionDate) },
    ];

    const columns2 = [
        { field: 'installmentCount', header: t('transactionDetail.tableTitle7'), className: "primary-text", },
        { field: 'cardType', header: t('transactionDetail.tableTitle8'), className: "", },
        { field: 'conversationId', header: t('transactionDetail.tableTitle9'), className: ""},
        { field: 'bankName', header: t('transactionDetail.tableTitle10'), className: "", },
    ];

    const header3 = (
        <div className="title">
            <img src={paymentIcon3} alt="" />
            <span>{t("transactionDetail.sectionTitle3")}</span>
        </div>
    );
    const columns3 = [
        { field: 'orderId', header: t('transactionDetail.tableTitle11'), className: "" },
        { field: 'amount', header: t('transactionDetail.tableTitle12'), className: "price-column", },
        { field: 'transactionType', header: t('transactionDetail.tableTitle13'), className: "" },
        { 
            field: 'transactionStatusDesc', 
            header: t('transactionDetail.tableTitle14'), 
            body: (rowData) => (
                rowData.transactionStatusCode === '00' ? <Tag severity="success" value="Başarılı"></Tag> : <Tag severity="waiting" value="Başarısız"></Tag>
            )
        },
        { field: 'description', header: t('transactionDetail.tableTitle15'), className: "" },
        { field: 'refundDatetime', header: t('transactionDetail.tableTitle16'), className: "" },
    ];
    
    const header4 = (
        <div className="title">
            <img src={paymentIcon4} alt="" />
            <span>{t("transactionDetail.sectionTitle4")}</span>
        </div>
    );
    const columns4 = [
        { field: 'cardFirstSix', header: t('transactionDetail.tableTitle17'), className: "", body: (rowData) => (rowData.cardFirstSix + rowData.cardLastFour) },
        { field: 'f043CardAcceptorName', header: t('transactionDetail.tableTitle18'), className: "" },
        { field: 'cardOrganization', header: t('transactionDetail.tableTitle19'), className: "" },
        { field: 'cardFamily', header: t('transactionDetail.tableTitle20'), className: "" },
        { field: 'cardType', header: t('transactionDetail.tableTitle21'), className: "" },

    ];
    

    // CANCEL API
    const handleCancelRecord = (guid) => {
        dispatch(cancelTransaction({
            merchantId: `${authData.merchantId}`,
            orderId: param,
            amount: guid,
            description: ""
        }))
        .unwrap()
        .then((result) => {
            setTimeout(() => {
                confirmSuccessDialog();
                
                if(param) {
                    dispatch(getTransactionDetail({
                        merchantId: `${authData.merchantId}`,
                        orderId: param
                    }));
                }
            }, 250);
        })
        .catch((error) => {
            setTimeout(() => {
                confirmWarningDialog(error);
            }, 250);
        });
    }

    const handleRefundRecord = (guid) => {
        dispatch(refundTransaction({
            merchantId: `${authData.merchantId}`,
            orderId: param,
            amount: guid,
            description: ""
        }))
        .unwrap()
        .then((result) => {
            setTimeout(() => {
                confirmSuccessDialog();
                
                if(param) {
                    dispatch(getTransactionDetail({
                        merchantId: `${authData.merchantId}`,
                        orderId: param
                    }));
                }
            }, 250);
        })
        .catch((error) => {
            setTimeout(() => {
                confirmWarningDialog(error);
            }, 250);
        });
    }

    // CANCEL FUNCTİON
    const confirmWarningDialog = (errorCode) => {
        showDialog(
        'warning',
        {
            title: t('transactionDetail.CancelDialogWarningTitle'),
            content: t('transactionDetail.CancelDialogWarningText'),
        },
        warningDialogIcon,
        errorCode,
        () => {}
        );
    };

    const confirmSuccessDialog = () => {
        showDialog(
        'success',
        {
            title: t('transactionDetail.CancelDialogSuccessTitle'),
            content: t('transactionDetail.CancelDialogSuccessText'),
        },
        successDialogIcon,
        null,
        () => {}
        );
    };
    
    const confirmCancelDialog = (guid) => {
        showDialog(
        'danger',
        {
            title: t('transactionDetail.CancelDialogTitle'),
            content: `<a href="#">${guid} TRY</a> ${t('transactionDetail.CancelDialogText')}`,
        },
        dangerDialogIcon,
        null,
        () => handleCancelRecord(guid)
        );
    };

    const confirmRefundDialog = (guid) => {
        showDialog(
        'danger2',
        {
            title: t('transactionDetail.RefundDialogTitle'),
            content: `<a href="#">${guid} TRY</a> ${t('transactionDetail.RefundDialogText')}`,
        },
        danger2DialogIcon,
        null,
        () => handleRefundRecord(guid)
        );
    };
    return (
        <>
            <ConfirmDialog group="ConfirmDialogTemplating" />
            <div className='detail-table-section'>
                {/*
                <div>
                    <h3>DetailTransaction Id:{param}</h3>
                </div>
                */}
                { !loading ? (
                    <>
                        <div className="datatable-area-container detail-page-table">
                            <DataTable 
                                header={header1}
                                value={transactionDetail} 
                                emptyMessage={t('common.recordEmptyMessage')}
                                currentPageReportTemplate={t('common.paginateText')}
                                dataKey="guid"
                                scrollable
                            >
                                {columns1.map((col, index) => (
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
                            <DataTable 
                                value={transactionDetail} 
                                emptyMessage={t('common.recordEmptyMessage')}
                                currentPageReportTemplate={t('common.paginateText')}
                                dataKey="guid"
                                scrollable
                            >
                                {columns2.map((col, index) => (
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
                        <div className="datatable-area-container detail-page-table">
                            <div className='refund-cancel-section'>
                                <div className="p-datatable-header">
                                    <div className="title">
                                        <img src={paymentIcon2} alt="" />
                                        <span>{t("transactionDetail.sectionTitle2")}</span>
                                    </div>
                                    <div className="text">{t("transactionDetail.sectionText2")}</div>
                                </div>
                                <div className="section-content">
                                    <div className="available-amount">
                                        <span>{t('transactionDetail.affordableAmount')}:</span><b>{availableAmount} TRY</b>
                                    </div>
                                    <div className="input-and-buttons">
                                        <InputNumber
                                            value={refundAmount}
                                            onValueChange={(e) => setRefundAmount(e.value)}
                                            min={0}
                                            max={availableAmount}
                                            minFractionDigits={2}
                                            locale="de-DE"
                                            placeholder='Tutar Giriniz.'
                                            className='p-form-control'
                                        />
                                        <button className="button refund-button" onClick={handleRefund}>
                                            <img src={refundIcon} />
                                            <span>{t('transactionDetail.refundButton')}</span>
                                        </button>
                                        <button className="button cancel-button" onClick={handleCancel}>
                                            <img src={cancelIcon} />
                                            <span>{t('transactionDetail.cancelButton')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <DataTable 
                                header={header3}
                                value={transactionDetail[0]?.refundHistory} 
                                emptyMessage={t('common.recordEmptyMessage')}
                                currentPageReportTemplate={t('common.paginateText')}
                                dataKey="guid"
                                scrollable
                            >
                                {columns3.map((col, index) => (
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
                        <div className="datatable-area-container detail-page-table">
                            <DataTable 
                                header={header4}
                                value={transactionDetail} 
                                emptyMessage={t('common.recordEmptyMessage')}
                                currentPageReportTemplate={t('common.paginateText')}
                                dataKey="guid"
                                scrollable
                            >
                                {columns4.map((col, index) => (
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
                    </>
                ) : (
                <div className="custom-table-progress-spinner">
                    <ProgressSpinner />
                </div>
                )}
            </div>
        </>
    )
}