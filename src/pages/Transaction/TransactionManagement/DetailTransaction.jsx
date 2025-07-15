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

export default function DetailTransaction() {
    const { param } = useParams();
    const { t } = useTranslation();
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authData = useSelector((state) => state.auth);


    const [refundAmount, setRefundAmount] = useState('');

    const availableAmount = '96,784';
    const numericAvailableAmount = parseFloat(availableAmount.replace(',', '.'));

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
        if (numericAmount > numericAvailableAmount) {
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

/*
    useEffect(()=> {
        console.log("transactionDetail1",transactionDetail1)
    }, [transactionDetail1])
*/
        
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
        { field: 'field1', header: t('transactionDetail.tableTitle1'), className: "", },
        { 
            field: 'field2', 
            header: t('transactionDetail.tableTitle2'), 
            body: (rowData) => (
              <div className="logos-text justify-content-center">
                <i><img src={smallLogo} /></i>
                <span>{rowData.field2}</span>
              </div>
            )
        },
        { field: 'field3', header: t('transactionDetail.tableTitle3'), className: "", },
        { field: 'field4', header: t('transactionDetail.tableTitle4'), className: "price-column", },
        { 
            field: 'field5', 
            header: t('transactionDetail.tableTitle5'), 
            body: (rowData) => (<Tag severity="success" value={rowData.field5}></Tag>)
        },
        { field: 'field6', header: t('transactionDetail.tableTitle6'), className: "", },
    ];
    const transactionDetail1 = [
        {
            guid: 0,
            field1 : "302012",
            field2 : "Mor POS",
            field3 : "Eray Şentürk",
            field4 : "500 TL",
            field5 : "Başarılı",
            field6 : "24.01.2025 14:00",
        }
    ];

        
    const columns2 = [
        { field: 'field1', header: t('transactionDetail.tableTitle7'), className: "primary-text", },
        { field: 'field2', header: t('transactionDetail.tableTitle8'), className: "", },
        { field: 'field3', header: t('transactionDetail.tableTitle9'), className: ""},
        { field: 'field4', header: t('transactionDetail.tableTitle10'), className: "", },
    ];
    const transactionDetail2 = [
        {
            guid: 1,
            field1 : "6 Taksit",
            field2 : "Kredi Kartı",
            field3 : "2322334340",
            field4 : "Penta Yazılım",
        }
    ];

        
    const header3 = (
        <div className="title">
            <img src={paymentIcon3} alt="" />
            <span>{t("transactionDetail.sectionTitle3")}</span>
        </div>
    );
    const columns3 = [
        { field: 'field1', header: t('transactionDetail.tableTitle11'), className: "" },
        { field: 'field2', header: t('transactionDetail.tableTitle12'), className: "price-column", },
        { field: 'field3', header: t('transactionDetail.tableTitle13'), className: "" },
        { 
            field: 'field4', 
            header: t('transactionDetail.tableTitle14'), 
            body: (rowData) => (
                rowData.field4 === 'Başarılı' ? 
                    <Tag severity="success" value={rowData.field4}></Tag> :
                rowData.field4 === 'Beklemede' ? 
                    <Tag severity="waiting" value={rowData.field4}></Tag> :
                    <Tag severity="waiting" value={rowData.field4}></Tag>
            )
        },
        { field: 'field5', header: t('transactionDetail.tableTitle15'), className: "" },
        { field: 'field6', header: t('transactionDetail.tableTitle16'), className: "" },
    ];
    const transactionDetail3 = [
        {
            guid: 2,
            field1 : "302012",
            field2 : "500 TL",
            field3 : "İade",
            field4 : "Başarılı",
            field5 : "Hatalı Ürün Talebi",
            field6 : "24.01.2025 14:00",
        },
        {
            guid: 3,
            field1 : "452010",
            field2 : "980 TL",
            field3 : "İade",
            field4 : "Beklemede",
            field5 : "İptal ve İade Talebi",
            field6 : "18.02.2025 18:20",
        }
    ];

        
    const header4 = (
        <div className="title">
            <img src={paymentIcon4} alt="" />
            <span>{t("transactionDetail.sectionTitle4")}</span>
        </div>
    );
    const columns4 = [
        { field: 'field1', header: t('transactionDetail.tableTitle17'), className: "" },
        { field: 'field2', header: t('transactionDetail.tableTitle18'), className: "" },
        { field: 'field3', header: t('transactionDetail.tableTitle19'), className: "" },
        { field: 'field4', header: t('transactionDetail.tableTitle20'), className: "" },
        { field: 'field5', header: t('transactionDetail.tableTitle21'), className: "" },

    ];
    const transactionDetail4 = [
        {
            guid: 4,
            field1 : "123456*****4560",
            field2 : "Eray Şentürk",
            field3 : "MasterCard",
            field4 : "Bonus",
            field5 : "Kredi Kartı",
        },
    ];

    

    // CANCEL API
    const handleCancelRecord = (guid) => {
        setTimeout(() => {
            confirmWarningDialog();
        }, 250);
        /*
        dispatch(CancelPaymentRecord(guid))
        .unwrap()
        .then((result) => {
            setTimeout(() => {
            confirmSuccessDialog();
            }, 250);
        })
        .catch((error) => {
            console.log("error!!!!!!!!!!",error)
            dispatch(setLinkPaymentListError(error));
            setTimeout(() => {
            confirmWarningDialog(error);
            }, 250);
        });
        */
    }

    const handleRefundRecord = (guid) => {
        setTimeout(() => {
            confirmSuccessDialog();
        }, 250);
        /*
        dispatch(CancelPaymentRecord(guid))
        .unwrap()
        .then((result) => {
            setTimeout(() => {
            confirmSuccessDialog();
            }, 250);
        })
        .catch((error) => {
            console.log("error!!!!!!!!!!",error)
            dispatch(setLinkPaymentListError(error));
            setTimeout(() => {
            confirmWarningDialog(error);
            }, 250);
        });
        */
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
                <div className="datatable-area-container detail-page-table">
                    <DataTable 
                        header={header1}
                        value={transactionDetail1} 
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
                        value={transactionDetail2} 
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
                                    max={numericAvailableAmount}
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
                        value={transactionDetail3} 
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
                        value={transactionDetail4} 
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
            </div>
        </>
    )
}