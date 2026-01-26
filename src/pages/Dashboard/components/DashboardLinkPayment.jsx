import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "primereact/carousel";
import { DataTable } from "primereact/datatable";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearLinkPaymentListState, deletePaymentRecord, getLinkPaymentList, setLinkPaymentListError, updateMerchantLinkPayment } from "../../../store/slices/linkPayment/linkPaymentListSlice";
import { ProgressSpinner } from "primereact/progressspinner";

import linkPaymentIcon from "@/assets/images/icons/share-link-1.svg";
import successDialogIcon from '@assets/images/icons/successDialogIcon.svg'
import dangerDialogIcon from '@assets/images/icons/dangerDialogIcon.svg'
import warningDialogIcon from '@assets/images/icons/warningDialogIcon.svg'
import { ConfirmDialog } from "primereact/confirmdialog";
import { Column } from "primereact/column";
import { priceFormat, showDialog } from "../../../utils/helpers";
import { InputSwitch } from "primereact/inputswitch";
import { OverlayPanel } from "primereact/overlaypanel";
import { toast } from "react-toastify";

export default function DashboardLinkPayment() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { loading, error, success, paymentList, deleteSuccess } = useSelector((state) => state.linkPaymentList);

  const share = useRef(null);

  useEffect(() => {
    dispatch(setLinkPaymentListError(null));
    dispatch(getLinkPaymentList(user.userName));
  }, [deleteSuccess]);

  
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

  const linkPaymentStatusUpdate = (rowData) => {
    const data = {
      guid: rowData.guid,
      productTypeGuid: rowData.productTypeGuid,
      currencyGuid: rowData.currencyGuid,
      merchantId: rowData.merchantId,
      productName: rowData.productName,
      productPrice: rowData.productPrice,
      productDescription: rowData.productDescription,
      linkDescription: rowData.linkDescription,
      merchantNameEnabled: rowData.merchantNameEnabled,
      merchantAddressEnabled: rowData.merchantAddressEnabled,
      installmentInfoEnabled: rowData.installmentInfoEnabled,
      stock: rowData.stock,
      remaingStock: rowData.remaingStock,
      productImageBase64: rowData.productImageBase64,
      linkUrl: rowData.linkUrl,
      linkPaymentStatusName: rowData.linkPaymentStatus.description,
      linkPaymentStatusGuid: rowData.linkPaymentStatusGuid == 3 ? 5 : 3,
      // linkPaymentStatusGuid satışa kapalıysa satışa aç satışa açıksa kapa
    }

    dispatch(updateMerchantLinkPayment(data))
      .unwrap()
      .then((result) => {
        toast.success(t("messages.success"));
        dispatch(clearLinkPaymentListState(null));
        dispatch(getLinkPaymentList(user.userName));
      })
      .catch((error) => {
        dispatch(setLinkPaymentListError(error));
        toast.error(error);
      });
  }

  const confirmUpdateDialog = (rowData) => {
    if(rowData.linkPaymentStatus?.guid === 3) {
      linkPaymentStatusUpdate(rowData);
    } else {
      showDialog(
        'danger',
        {
            title: t('messages.UpdateDialogTitle'),
            content: t('messages.UpdateDialogText'),
        },
        dangerDialogIcon,
        null,
        () => linkPaymentStatusUpdate(rowData)
      );
    }
  };

  const linkPaymentUrl = (rowData) => {
    if(rowData.linkPaymentStatusGuid != 5 || rowData.remaingStock == 0) {
      toast.error(t("linkPayment.paymentStatusError"));
      return
    }
    navigate(`/linkpayment/${rowData.linkUrlKey}`);
  }
  
  return (
    <>
      <ConfirmDialog group="ConfirmDialogTemplating" />
      
      <div className="dashboard-link-header">
        <div>
          <div className="title">
            <i><img src={linkPaymentIcon} alt="" /></i>
            <span>{t('dashboards.linkPaymentTitle1')}</span>
            <div>{t('dashboards.linkPaymentTitle2')}</div>
          </div>
          <div className="text" dangerouslySetInnerHTML={{ __html: t("dashboards.linkPaymentTitle3") }}></div>
        </div>
        <div className="flex-fill">  
          <Link className="primary-button" to={`/create-link-payment`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M22 11.1289V18.5625C22 20.458 20.458 22 18.5625 22H3.4375C1.54201 22 0 20.458 0 18.5625V3.4375C0 1.54201 1.54201 0 3.4375 0H10.9141C11.3887 0 11.7734 0.384705 11.7734 0.859375C11.7734 1.33405 11.3887 1.71875 10.9141 1.71875H3.4375C2.48984 1.71875 1.71875 2.48984 1.71875 3.4375V18.5625C1.71875 19.5102 2.48984 20.2812 3.4375 20.2812H18.5625C19.5102 20.2812 20.2812 19.5102 20.2812 18.5625V11.1289C20.2812 10.6542 20.666 10.2695 21.1406 10.2695C21.6153 10.2695 22 10.6542 22 11.1289ZM11.7377 7.98296C11.754 8.01669 11.7723 8.04959 11.7926 8.08081C11.8577 8.18102 12.0096 8.41096 12.1811 8.64645L9.36115 11.4664C9.02545 11.8021 9.02545 12.3463 9.36115 12.6818C9.52882 12.8497 9.74887 12.9336 9.96875 12.9336C10.1886 12.9336 10.4087 12.8497 10.5764 12.682L12.1323 11.1261C12.1692 11.1935 12.205 11.2615 12.2382 11.3275C12.3923 11.6526 12.4703 11.9804 12.4703 12.3022C12.4703 13.1813 11.968 14.1525 11.017 15.1117L10.9377 15.1804C10.9063 15.2076 10.877 15.237 10.8498 15.2683L10.7815 15.3472C9.82138 16.2984 8.85039 16.8008 7.97171 16.8008C7.48714 16.8008 7.03899 16.6514 6.60359 16.3446C6.58798 16.3308 6.57187 16.3174 6.55542 16.3046L6.47183 16.2407C6.34763 16.1455 6.22476 16.0374 6.10677 15.9194C5.52501 15.3385 5.24219 14.7339 5.24219 14.0713C5.24219 13.1919 5.74472 12.2207 6.69574 11.2613L6.77513 11.1927C6.80618 11.1657 6.83539 11.1366 6.86224 11.1056L6.93089 11.0264C7.68335 10.2806 8.41264 9.81735 9.09897 9.64934C9.55988 9.53654 9.84219 9.07127 9.72923 8.6102C9.61644 8.14929 9.15134 7.86697 8.69026 7.97977C7.68822 8.22516 6.68063 8.84787 5.69521 9.83128C5.68044 9.84605 5.66617 9.86116 5.65257 9.87694L5.60339 9.93367L5.54666 9.98285C5.53088 9.99644 5.51561 10.0107 5.50101 10.0253C4.20724 11.3211 3.52344 12.7201 3.52344 14.0713C3.52344 15.1977 3.98401 16.2288 4.89223 17.1356C5.0631 17.3063 5.24269 17.4641 5.42615 17.6048L5.45384 17.6259C5.47818 17.6487 5.50403 17.6702 5.53105 17.69C6.27864 18.2406 7.09975 18.5195 7.97171 18.5195C9.32204 18.5195 10.721 17.8357 12.0175 16.5421C12.0324 16.5272 12.0467 16.5117 12.0605 16.4958L12.1091 16.4396L12.1657 16.3907C12.1815 16.377 12.1969 16.3627 12.2117 16.3479C13.5053 15.0522 14.1891 13.6532 14.1891 12.3022C14.1891 11.7196 14.0533 11.14 13.7856 10.5795C13.7834 10.5748 13.7812 10.5701 13.7789 10.5656C13.7183 10.4444 13.5707 10.1584 13.3893 9.86888L16.1623 7.09589C16.4978 6.76036 16.4978 6.2162 16.1623 5.88051C15.8266 5.54498 15.2824 5.54498 14.9469 5.88051L13.4143 7.41312C13.3631 7.3391 13.3126 7.26424 13.2658 7.19341C13.1244 6.88205 13.0529 6.56834 13.0529 6.26018C13.0529 5.381 13.5555 4.41 14.5063 3.45059L14.5857 3.38194C14.6171 3.35475 14.6465 3.32555 14.6735 3.29416L14.7416 3.2151C15.7019 2.26408 16.673 1.76155 17.5516 1.76155C18.0361 1.76155 18.4845 1.91093 18.9198 2.21793C18.9355 2.23169 18.9514 2.24495 18.968 2.25771L19.0514 2.32166C19.1755 2.41682 19.2983 2.52492 19.4167 2.64291C19.9984 3.22383 20.2812 3.82841 20.2812 4.49124C20.2812 5.37042 19.7787 6.34158 18.8277 7.30099L18.7483 7.36981C18.7173 7.39667 18.688 7.42587 18.6612 7.45692L18.5927 7.53598C17.8547 8.26662 17.1039 8.71863 16.361 8.87959C15.8973 8.97997 15.6025 9.43752 15.7031 9.90128C15.7902 10.3039 16.1463 10.5789 16.5421 10.5789C16.6024 10.5789 16.6635 10.5727 16.7247 10.5592C17.8022 10.3261 18.8463 9.71094 19.8284 8.73105C19.8432 8.71645 19.8573 8.70117 19.871 8.68539L19.92 8.62866L19.9769 8.57948C19.9926 8.56589 20.0078 8.55162 20.0224 8.53702C21.3162 7.24141 22 5.84241 22 4.49124C22 3.36482 21.5394 2.33374 20.6312 1.42686C20.4602 1.256 20.2806 1.09822 20.0973 0.957733L20.0694 0.936249C20.0451 0.91359 20.0192 0.892273 19.9924 0.872467C19.245 0.32193 18.4237 0.0428009 17.5517 0.0428009C16.2016 0.0428009 14.8026 0.726608 13.506 2.02037C13.4912 2.03514 13.4767 2.05058 13.463 2.06653L13.4143 2.12292L13.3576 2.17194C13.3418 2.18553 13.3265 2.1998 13.3118 2.21457C12.0182 3.51018 11.3344 4.90935 11.3344 6.26035C11.3344 6.84294 11.47 7.42252 11.7377 7.98296Z" fill="white"/>
            </svg>
            <span>{t('linkPayment.linkCreateButton')}</span>
          </Link>
          <Link className="secondary-button" to={`/link-payment-list`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.0638 11.6614C19.8151 11.6614 19.5765 11.7602 19.4007 11.9361C19.2248 12.1119 19.126 12.3505 19.126 12.5992V16.3742C19.1251 17.1033 18.8351 17.8023 18.3196 18.3179C17.804 18.8334 17.105 19.1234 16.3759 19.1243H5.63348C4.90437 19.1234 4.20535 18.8334 3.68979 18.3179C3.17423 17.8023 2.88423 17.1033 2.8834 16.3742V5.63177C2.88423 4.90266 3.17423 4.20364 3.68979 3.68808C4.20535 3.17252 4.90437 2.88252 5.63348 2.88169H9.40849C9.6572 2.88169 9.89573 2.78289 10.0716 2.60702C10.2475 2.43115 10.3463 2.19261 10.3463 1.9439C10.3463 1.69518 10.2475 1.45665 10.0716 1.28078C9.89573 1.10491 9.6572 1.0061 9.40849 1.0061H5.63348C4.40712 1.00755 3.2314 1.49536 2.36424 2.36253C1.49707 3.2297 1.00926 4.40541 1.00781 5.63177V16.3742C1.00926 17.6005 1.49707 18.7763 2.36424 19.6434C3.2314 20.5106 4.40712 20.9984 5.63348 20.9999H16.3759C17.6023 20.9984 18.778 20.5106 19.6451 19.6434C20.5123 18.7763 21.0001 17.6005 21.0016 16.3742V12.5992C21.0016 12.3505 20.9028 12.1119 20.7269 11.9361C20.551 11.7602 20.3125 11.6614 20.0638 11.6614Z" fill="#8200BA"/>
              <path d="M20.046 1H14.2161C13.9705 0.999953 13.7347 1.09623 13.5594 1.26815C13.384 1.44007 13.2831 1.67391 13.2783 1.91943C13.2685 2.44576 13.7113 2.87559 14.2372 2.87559H17.8059L10.3372 10.3467C10.1613 10.5225 10.0625 10.7611 10.0625 11.0098C10.0625 11.2585 10.1613 11.497 10.3372 11.6729C10.513 11.8487 10.7515 11.9475 11.0002 11.9475C11.249 11.9475 11.4875 11.8487 11.6633 11.6729L19.1344 4.20413V7.78571C19.1344 8.03443 19.2332 8.27296 19.4091 8.44883C19.585 8.6247 19.8235 8.72351 20.0722 8.72351C20.3209 8.72351 20.5595 8.6247 20.7353 8.44883C20.9112 8.27296 21.01 8.03443 21.01 7.78571V1.96358C21.01 1.83701 20.9851 1.71168 20.9366 1.59475C20.8882 1.47781 20.8172 1.37157 20.7277 1.28209C20.6381 1.19261 20.5319 1.12164 20.4149 1.07324C20.298 1.02483 20.1726 0.999949 20.046 1Z" fill="#8200BA"/>
            </svg>
            <span>{t('menu.allMorLinks')}</span>
          </Link>
        </div>
      </div>
      
      <div className="box-title">
        <span>{t("dashboards.linkPaymentTitle4")}</span>
      </div>

      <DataTable 
        className='custom-datatable-2'
        value={paymentList?.slice(0,4)} 
        emptyMessage={emptyMessage}
        currentPageReportTemplate={t('common.paginateText')}
        scrollable>
          
        <Column className="product-content-column" field="productName" header={t('linkPayment.productNameDescription')} body={(rowData) => (rowData.productName)} />
        <Column field="productPrice" className="productPrice" header={t('linkPayment.productPriceHeader')} body={(rowData) => (
          <div className="product-price">{`${priceFormat(rowData.productPrice)} ${rowData.currency?.alphabeticCode}`}</div>
        )} />
        
        <Column field="linkUrlKey" className="linkUrlKey" header={t('linkPayment.linkUrlHeader')} body={(rowData) => (
          <div className="link-url-button">
            <a href={`/linkpayment/${rowData.linkUrlKey}`} target="_blank">
              <span>https://mymoor.link/{rowData.linkUrlKey}</span>
              <i className="pi pi-external-link"></i>
            </a>
          </div>
        )} />
        <Column field="productType.name" className="productType" header={t('linkPayment.productTypeHeader')} body={(rowData)=> (
          <span>{t(`common.${rowData.productType?.name}`)}</span>
        )}/>
        <Column field="linkPaymentStatus.merchantEnabled" header={t('linkPayment.statusHeader')} className="status-column" body={(rowData)=> (
          <div onClick={()=>confirmUpdateDialog(rowData)}>
            <InputSwitch checked={rowData.linkPaymentStatus?.guid !== 3}/>
            <span className="d-none">{rowData.linkPaymentStatus?.description}</span>
          </div>
        )}/>
        <Column
          field="guid"
          className="custom-row-column-wrapper"
          headerStyle={{ width: '3rem' }}
          header={t('linkPayment.actionHeader')}
          body={(rowData)=> (
            <div className="row-user-buttons">
              <Link to={`/detail-payment/${rowData.guid}`}>
                <i className="pi pi-eye" style={{fontSize: '22px'}}></i>
              </Link>
              {/* <Link to={`/detail-payment/${rowData.guid}`}>
                <i className="pi pi-pencil"></i>
              </Link> */}
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
              <a onClick={()=>linkPaymentUrl(rowData)} target="_blank">
                <i className="pi pi-external-link"></i>
              </a>
              <div onClick={()=>confirmDeleteDialog(rowData.guid)}>
                <i className="pi pi-trash" style={{color:'#EB3D4D'}}></i>
              </div>
            </div>
          )}
        />
      </DataTable>
    </>
  );
}