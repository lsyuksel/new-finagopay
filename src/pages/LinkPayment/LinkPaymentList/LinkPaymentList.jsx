import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deletePaymentRecord, getLinkPaymentList, setLinkPaymentListError } from "../../../store/slices/linkPayment/linkPaymentListSlice";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

import linkPaymentIcon from "@/assets/images/icons/link-payment-icon.svg";
import { InputSwitch } from "primereact/inputswitch";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { ProgressSpinner } from "primereact/progressspinner";
import successDialogIcon from '@assets/images/icons/successDialogIcon.svg'
import dangerDialogIcon from '@assets/images/icons/dangerDialogIcon.svg'
import warningDialogIcon from '@assets/images/icons/warningDialogIcon.svg'

import { showDialog } from "@/utils/helpers.jsx";
import { toast } from "react-toastify";

export default function LinkPaymentList() {
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [tableType, setTableType] = useState(2);
  const share = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, success, paymentList, deleteSuccess } = useSelector((state) => state.linkPaymentList);

  useEffect(() => {
    setSelectedProducts(null);
    dispatch(setLinkPaymentListError(null));
    dispatch(getLinkPaymentList(user.userName));
  }, [deleteSuccess]);

  const handleTableType = (type) => {
    setTableType(type);
  }
  
  const emptyMessage = () => {
    return !loading ? (
        <b>{t('common.emptyMessage')}</b>
    ) : (
      <div className="table-progress-spinner">
          <ProgressSpinner />
      </div>
    );
  };

  // DELETE API
  const handleDeleteRecord = (guid) => {
    dispatch(deletePaymentRecord(guid))
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
  }

  // DELETE FUNCTİON
  const confirmWarningDialog = (errorCode) => {
    showDialog(
      'warning',
      {
          title: t('messages.DeletionDialogWarningTitle'),
          content: t('messages.DeletionDialogWarningText'),
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
          title: t('messages.DeletionDialogSuccessTitle'),
          content: t('messages.DeletionDialogSuccessText'),
      },
      successDialogIcon,
      null,
      () => {}
    );
  };

  const confirmDeleteDialog = (guid) => {
    showDialog(
      'danger',
      {
          title: t('messages.DeletionDialogTitle'),
          content: t('messages.DeletionDialogText'),
      },
      dangerDialogIcon,
      null,
      () => handleDeleteRecord(guid)
    );
  };

  return (
    <>
      <ConfirmDialog group="ConfirmDialogTemplating" />
      <div className="payment-page-info-box">
        <i><img src={linkPaymentIcon} alt="" /></i>
        <div>
          <div className="title">{t('linkPayment.paymentListTitle')}</div>
          <div className="text">{t('linkPayment.paymentListText')}</div>
        </div>
      </div>
      <div>
        <DataTable 
          className={`${tableType === 1 ? 'card-datatable-view' : ''} custom-datatable-2`}
          value={paymentList} 
          paginator 
          rows={5} 
          rowsPerPageOptions={[5, 10, 25, 50]} 
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          emptyMessage={emptyMessage}
          currentPageReportTemplate={t('common.paginateText')}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}

          removableSort 
          dataKey="guid">
  
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

          <Column field="productImageBase64" headerStyle={{ width: '3rem' }} header="Fotoğraf" body={(rowData) => (
            <>
              <div className="product-picture">
                <img src={`data:image/png;base64,${rowData.productImageBase64}`} alt={rowData.productName} />
              </div>
            </>
          )} />
          <Column sortable className="product-content-column" field="productName" header="Ürün Adı/Açıklaması" body={(rowData) => (
            <>
              <div className="product-name">{rowData.productName}</div>
              <div className="product-description">{rowData.productDescription}</div>
              <div className="product-price d-none">{`${rowData.productPrice} ${rowData.currency?.alphabeticCode}`}</div>
            </>
          )} />
          <Column sortable field="productPrice" headerClassName="center-column" className="productPrice center-column" header="Ürünün Fiyatı" body={(rowData) => (
            <div className="product-price">{`${rowData.productPrice} ${rowData.currency?.alphabeticCode}`}</div>
          )} />
          <Column sortable field="productType.name" headerClassName="center-column" className="productType center-column" header="Ürün Tipi" body={(rowData)=> (
            <div className="product-type">
              <span className={rowData.productType?.guid === 2 ? 'text-success' : ''}>{t(`common.${rowData.productType?.name}`)}</span>
            </div>
          )}/>
          <Column sortable field="linkPaymentStatus.merchantEnabled" header="Durum" headerClassName="center-column" className="status-column center-column" body={(rowData)=> (
            <>
              <div className="d-none morlink-button">
                <span>{t('common.MorLinkAddress')}</span>
                {/*rowData.linkUrl*/}
                <a href={`/linkpayment/${rowData.linkUrlKey}`} target="_blank">
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <rect width="26" height="26" rx="8" fill="#EAF2FF"/>
                    <path d="M13.5406 15.711L11.3707 17.8809C11.3707 17.8809 11.3707 17.881 11.3706 17.881C11.3706 17.881 11.3706 17.881 11.3706 17.881C10.4733 18.7784 9.01314 18.7784 8.11573 17.881C7.68098 17.4463 7.44162 16.8683 7.44162 16.2535C7.44162 15.6389 7.68098 15.061 8.11557 14.6262C8.11563 14.6262 8.11568 14.6261 8.11573 14.6261L10.2856 12.4561C10.5852 12.1565 10.5852 11.6707 10.2856 11.3712C9.986 11.0716 9.50021 11.0716 9.20059 11.3712L7.03071 13.5411C7.03055 13.5412 7.0304 13.5415 7.03025 13.5416C6.30607 14.266 5.90723 15.2292 5.90723 16.2535C5.90723 17.2782 6.30622 18.2414 7.03076 18.966C7.77862 19.7138 8.76089 20.0877 9.74321 20.0877C10.7255 20.0877 11.7078 19.7138 12.4556 18.966C12.4557 18.966 12.4557 18.9659 12.4557 18.9659L14.6255 16.7959C14.9251 16.4964 14.9251 16.0106 14.6255 15.711C14.326 15.4114 13.8402 15.4114 13.5406 15.711Z" fill="#1D7AFC"/>
                    <path d="M20.0887 9.7443C20.0887 8.71969 19.6896 7.75639 18.9651 7.03185C17.4694 5.53623 15.0358 5.53628 13.5403 7.03185C13.5402 7.03196 13.5401 7.03201 13.5401 7.03211L11.3702 9.20189C11.0706 9.50146 11.0706 9.9873 11.3702 10.2869C11.5201 10.4367 11.7164 10.5116 11.9127 10.5116C12.109 10.5116 12.3054 10.4367 12.4552 10.2869L14.625 8.11708C14.6251 8.11698 14.6252 8.11693 14.6253 8.11682C15.5226 7.21951 16.9827 7.21946 17.8801 8.11682C18.3148 8.55157 18.5543 9.12957 18.5543 9.7443C18.5543 10.359 18.3149 10.9369 17.8803 11.3716L17.8801 11.3718L15.7102 13.5417C15.4107 13.8413 15.4107 14.3271 15.7103 14.6267C15.8601 14.7765 16.0565 14.8514 16.2528 14.8514C16.4491 14.8514 16.6455 14.7765 16.7953 14.6267L18.9652 12.4567C18.9653 12.4566 18.9655 12.4564 18.9656 12.4562C19.6898 11.7318 20.0887 10.7687 20.0887 9.7443Z" fill="#1D7AFC"/>
                    <path d="M10.2882 15.712C10.438 15.8618 10.6343 15.9368 10.8306 15.9368C11.027 15.9368 11.2233 15.8618 11.3732 15.712L15.713 11.3721C16.0126 11.0726 16.0126 10.5868 15.713 10.2872C15.4135 9.98761 14.9277 9.98761 14.6281 10.2872L10.2882 14.627C9.98857 14.9267 9.98857 15.4125 10.2882 15.712Z" fill="#1D7AFC"/>
                  </svg>
                  <span>https://mymoor.link/{rowData.linkUrlKey}</span>
                </a>
              </div>
              <div>
                <InputSwitch checked={rowData.linkPaymentStatus?.merchantEnabled}/>
                <span className="d-none">{t(`common.ForSale${rowData.linkPaymentStatus?.merchantEnabled}`)}</span>
              </div>
            </>
          )}/>
          <Column
            field="guid"
            headerClassName="d-none"
            className="d-none w-100"
            body={(rowData)=> (
              <>
                <div className="user-share-container">
                  <span>{t('common.share')}</span>
                  <div>
                    <div><i className="fa-brands fa-facebook-f"></i></div>
                    <div><i className="pi pi-twitter"></i></div>
                    <div><i className="pi pi-instagram"></i></div>
                    <div><i className="pi pi-whatsapp"></i></div>
                    <div><i className="fa-brands fa-linkedin-in"></i></div>
                    <div><i className="pi pi-send"></i></div>
                  </div>
                </div>
                <div className="row-user-buttons">
                {/*
                  {rowData.guid}
                */}
                  <div>
                    <i className="pi pi-pencil"></i>
                    <span>Düzenle</span>
                  </div>
                  <div onClick={()=>confirmDeleteDialog(rowData.guid)}>
                    <i className="pi pi-trash" style={{color:'#EB3D4D'}}></i>
                    <span style={{color:'#EB3D4D'}}>Moorlink’i Sil</span>
                  </div>
                </div>
              </>
            )}
          />
          <Column
            field="guid"
            headerClassName="custom-column-wrapper"
            className="custom-row-column-wrapper"
            headerStyle={{ width: '3rem' }}
            header={
              <>
                  <span>Aksiyon</span>
                  <div className="design-buttons">
                    <div onClick={()=> handleTableType(1)} className={tableType === 1 ? 'active' : ''}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M7.59653 0H2.54409C1.14129 0 0 1.14129 0 2.54409V7.59653C0 8.99933 1.14129 10.1406 2.54409 10.1406H7.59653C8.99933 10.1406 10.1406 8.99933 10.1406 7.59653V2.54409C10.1406 1.14129 8.99933 0 7.59653 0ZM8.42188 7.59653C8.42188 8.05161 8.05161 8.42188 7.59653 8.42188H2.54409C2.08901 8.42188 1.71875 8.05161 1.71875 7.59653V2.54409C1.71875 2.08901 2.08901 1.71875 2.54409 1.71875H7.59653C8.05161 1.71875 8.42188 2.08901 8.42188 2.54409V7.59653Z" fill="currentColor"/>
                        <path d="M19.4219 0H14.4375C13.0159 0 11.8594 1.15655 11.8594 2.57812V7.5625C11.8594 8.98408 13.0159 10.1406 14.4375 10.1406H19.4219C20.8435 10.1406 22 8.98408 22 7.5625V2.57812C22 1.15655 20.8435 0 19.4219 0ZM20.2812 7.5625C20.2812 8.03636 19.8957 8.42188 19.4219 8.42188H14.4375C13.9636 8.42188 13.5781 8.03636 13.5781 7.5625V2.57812C13.5781 2.10427 13.9636 1.71875 14.4375 1.71875H19.4219C19.8957 1.71875 20.2812 2.10427 20.2812 2.57812V7.5625Z" fill="currentColor"/>
                        <path d="M7.59653 11.8594H2.54409C1.14129 11.8594 0 13.0007 0 14.4035V19.4559C0 20.8587 1.14129 22 2.54409 22H7.59653C8.99933 22 10.1406 20.8587 10.1406 19.4559V14.4035C10.1406 13.0007 8.99933 11.8594 7.59653 11.8594ZM8.42188 19.4559C8.42188 19.911 8.05161 20.2812 7.59653 20.2812H2.54409C2.08901 20.2812 1.71875 19.911 1.71875 19.4559V14.4035C1.71875 13.9484 2.08901 13.5781 2.54409 13.5781H7.59653C8.05161 13.5781 8.42188 13.9484 8.42188 14.4035V19.4559Z" fill="currentColor"/>
                        <path d="M19.4219 11.8594H14.4375C13.0159 11.8594 11.8594 13.0159 11.8594 14.4375V19.4219C11.8594 20.8435 13.0159 22 14.4375 22H19.4219C20.8435 22 22 20.8435 22 19.4219V14.4375C22 13.0159 20.8435 11.8594 19.4219 11.8594ZM20.2812 19.4219C20.2812 19.8957 19.8957 20.2812 19.4219 20.2812H14.4375C13.9636 20.2812 13.5781 19.8957 13.5781 19.4219V14.4375C13.5781 13.9636 13.9636 13.5781 14.4375 13.5781H19.4219C19.8957 13.5781 20.2812 13.9636 20.2812 14.4375V19.4219Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div onClick={()=> handleTableType(2)} className={tableType === 2 ? 'active' : ''}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M2.02529 2.76172C0.908574 2.76172 0 3.67025 0 4.78696C0 5.90368 0.908574 6.81221 2.02529 6.81221C3.142 6.81221 4.05054 5.90368 4.05054 4.78696C4.05054 3.67025 3.142 2.76172 2.02529 2.76172ZM2.02529 5.52315C1.61936 5.52315 1.28906 5.19289 1.28906 4.78696C1.28906 4.38104 1.61936 4.05078 2.02529 4.05078C2.43121 4.05078 2.76147 4.38104 2.76147 4.78696C2.76147 5.19289 2.43121 5.52315 2.02529 5.52315Z" fill="currentColor"/>
                        <path d="M2.02529 8.97461C0.908574 8.97461 0 9.88314 0 10.9999C0 12.1166 0.908574 13.0251 2.02529 13.0251C3.142 13.0251 4.05054 12.1166 4.05054 10.9999C4.05054 9.88314 3.142 8.97461 2.02529 8.97461ZM2.02529 11.736C1.61936 11.736 1.28906 11.4058 1.28906 10.9999C1.28906 10.5939 1.61936 10.2637 2.02529 10.2637C2.43121 10.2637 2.76147 10.5939 2.76147 10.9999C2.76147 11.4058 2.43121 11.736 2.02529 11.736Z" fill="currentColor"/>
                        <path d="M2.02529 15.1875C0.908574 15.1875 0 16.096 0 17.2127C0 18.3295 0.908574 19.238 2.02529 19.238C3.142 19.238 4.05054 18.3295 4.05054 17.2127C4.05054 16.096 3.142 15.1875 2.02529 15.1875ZM2.02529 17.9489C1.61936 17.9489 1.28906 17.6187 1.28906 17.2127C1.28906 16.8068 1.61936 16.4766 2.02529 16.4766C2.43121 16.4766 2.76147 16.8068 2.76147 17.2127C2.76147 17.6187 2.43121 17.9489 2.02529 17.9489Z" fill="currentColor"/>
                        <path d="M7.548 6.81221H19.9759C21.0923 6.81221 22.0005 5.90398 22.0005 4.78765C22.0005 3.66991 21.0923 2.76172 19.9759 2.76172H7.548C6.43167 2.76172 5.52344 3.66995 5.52344 4.78765C5.52344 5.90398 6.43167 6.81221 7.548 6.81221ZM7.548 4.05078H19.9759C20.3815 4.05078 20.7114 4.38074 20.7114 4.78628C20.7114 5.19323 20.3815 5.52315 19.9759 5.52315H7.548C7.14246 5.52315 6.8125 5.19319 6.8125 4.78628C6.8125 4.3807 7.14246 4.05078 7.548 4.05078Z" fill="currentColor"/>
                        <path d="M19.976 8.97461H7.548C6.43167 8.97461 5.52344 9.88284 5.52344 11.0005C5.52344 12.1169 6.43167 13.0251 7.548 13.0251H19.9759C21.0923 13.0251 22.0005 12.1169 22.0005 11.0005C22.0005 9.8828 21.0923 8.97461 19.976 8.97461ZM19.976 11.736H7.548C7.14246 11.736 6.8125 11.4061 6.8125 10.9992C6.8125 10.5936 7.14246 10.2637 7.548 10.2637H19.9759C20.3815 10.2637 20.7114 10.5936 20.7114 10.9992C20.7115 11.4061 20.3815 11.736 19.976 11.736Z" fill="currentColor"/>
                        <path d="M19.976 15.1875H7.548C6.43167 15.1875 5.52344 16.0957 5.52344 17.2134C5.52344 18.3298 6.43167 19.238 7.548 19.238H19.9759C21.0923 19.238 22.0005 18.3298 22.0005 17.2134C22.0005 16.0957 21.0923 15.1875 19.976 15.1875ZM19.976 17.9489H7.548C7.14246 17.9489 6.8125 17.619 6.8125 17.2121C6.8125 16.8065 7.14246 16.4766 7.548 16.4766H19.9759C20.3815 16.4766 20.7114 16.8065 20.7114 17.2121C20.7115 17.619 20.3815 17.9489 19.976 17.9489Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
              </>
            } 
            body={(rowData)=> (
              <div className="row-user-buttons">
              {/*
                {rowData.guid}
              */}
                <div>
                  <i className="pi pi-eye" style={{fontSize: '22px'}}></i>
                </div>
                <div>
                  <i className="pi pi-pencil"></i>
                </div>
                <div onClick={(e) => share.current.toggle(e)}>
                  <i className="pi pi-share-alt"></i>
                  <OverlayPanel className="user-share-overlay" ref={share}>
                    <div className="user-share-container">
                      <span>{t('common.share')}</span>
                      <div>
                        <div><i className="fa-brands fa-facebook-f"></i></div>
                        <div><i className="pi pi-twitter"></i></div>
                        <div><i className="pi pi-instagram"></i></div>
                        <div><i className="pi pi-whatsapp"></i></div>
                        <div><i className="fa-brands fa-linkedin-in"></i></div>
                        <div><i className="pi pi-send"></i></div>
                      </div>
                    </div>
                  </OverlayPanel>
                </div>
                <div>
                  <i className="pi pi-external-link"></i>
                </div>
                <div onClick={()=>confirmDeleteDialog(rowData.guid)}>
                  <i className="pi pi-trash" style={{color:'#EB3D4D'}}></i>
                </div>
              </div>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}