import { t } from 'i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import ReportsFilterDialog from '../../../components/Common/Table/ReportsFilterDialog';
import DateFilter from '../../../components/Common/Table/DateFilter';

import ButtonIcon1 from "@/assets/images/icons/advanced-search.svg";
import ButtonIcon2 from "@/assets/images/icons/by-date.svg";
import printIcon from "@/assets/images/icons/print-icon.svg";

import ExcelIcon from '@assets/images/icons/excel.svg';
import CsvIcon from '@assets/images/icons/csv.svg';

import { formatDate, getDateRange } from '../../../utils/helpers';

import DateRangeDialog from '../../../components/Common/Table/DateRangeDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'react-bootstrap';
import { exportDataToCSV, exportDataToExcel } from '../../../utils/exportUtils';
import { getMerchantReconciliationList, setMerchantReconciliationListError } from '../../../store/slices/reports/merchantReconciliationSlice';
import { getAllPayOutStatusDef } from '../../../store/slices/selectOptionSlice';

export default function MerchantReconciliation() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState(null);

  const [filteredList, setFilteredList] = useState(null);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);

  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRange, setSelectedRange] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  
  const [reconciliationDialogVisible, setReconciliationDialogVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const selectOptions = useSelector((state) => state.selectOptions);
  
  const { loading, error, success, merchantReconciliationList, deleteSuccess } = useSelector((state) => state.merchantReconciliationList);
  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    setSelectedProducts(null);
    dispatch(setMerchantReconciliationListError(null));

    dispatch(getAllPayOutStatusDef())
  }, [])
  
  useEffect(()=> {
    console.log("merchantReconciliationList99",merchantReconciliationList)
  }, [merchantReconciliationList])

  const columns = [
    { field: 'merchantPayment.merchant.merchantId', header: t('Üye İşyeri Numarası'), sortable: true, className: "primary-text", },
    { field: 'merchantPayment.domesticBank.bankName', header: t('Banka Adı'), sortable: true },
    { field: 'merchantPayOut.iban', header: t('Iban'), sortable: true },
    { field: 'merchantPayment.currency.currencyName', header: t('Para Birimi'), sortable: true },

    { field: 'merchantPayment.eodDate', header: t('Günsonu Tarihi'), className: "", sortable: true, body: (rowData) => formatDate(rowData.merchantPayment.eodDate) },
    { field: 'merchantPayment.paymentDate', header: t('Ödeme Tarihi'), className: "", sortable: true, body: (rowData) => formatDate(rowData.merchantPayment.paymentDate) },

    { field: 'payOutStatus.description', header: t('Ödeme Durumu'), sortable: true },
    { field: 'merchantPayment.ravenTransactionType.description', header: t('İşlem Tİpi'), sortable: true },
    { field: 'merchantPayment.totalRecordCount', header: t('Toplam İşlem Sayısı'), sortable: true },
    { field: 'merchantPayment.totalAmount', header: t('Toplam Tutar'), sortable: true },
    { field: 'merchantPayment.totalNetAmount', header: t('Toplam Net Tutar'), sortable: true },
    { field: 'merchantPayment.totalPayFacCommissionAmount', header: t('Toplam PayFac Komisyon Tutarı'), sortable: true },
    { field: 'merchantPayment.totalPayFacBsmvAmount', header: t('Toplam Bsmv'), sortable: true },

    { field: 'merchantPayment.totalTransactionAmountTL', header: t('Toplam İşlem Tutarı (TL)'), sortable: true },
    { field: 'merchantPayment.totalPayFacCommissionAmountTL', header: t('Toplam PayFac Komsiyon Tutarı (TL)'), sortable: true },
    { field: 'merchantPayment.totalPayFacBsmvAmountTL', header: t('Toplam Bsmv Tutarı (TL)'), sortable: true },
    { field: 'merchantPayment.merchantPaymentType.name', header: t('Ödeme Yöntemi'), sortable: true },
    { field: 'paymentStatusDescription', header: t('EFT Açıklaması'), sortable: true },
    { field: 'paymentStatusCode', header: t('EFT Statüsü'), sortable: true },
    {
        field: 'selection',
        header: t('common.actions'),
        alignFrozen: "right",
        frozen: true,
        body: (rowData) => (
            <div className="row-user-buttons">
                <Button tooltip="Görüntüle" className='p-tooltip-button' tooltipOptions={{ position: 'bottom' }} onClick={()=>reconciliationDialogShow(rowData)}>
                  <i className="pi pi-eye" style={{fontSize: '22px'}}></i>
                </Button>
                {/* <div><i className="fa-regular fa-file-lines"></i></div> */}
            </div>
        ),
        className: "fixed-user-buttons"
    },
  ];

  const reconciliationDialogShow = (rowData) => {
    setSelectedRowData(rowData);
    console.log("rowData",rowData);
    setReconciliationDialogVisible(true);
  };

  const handleFilter = (filters) => {
    console.log("handleFilter filters",filters)

    const dateRange = getDateRange(selectedDateFilter);
    dispatch(getMerchantReconciliationList({
      //merchantId: `${authData.merchantId}`,
      userName: user.userName,
      paymentDateStartDate: dateRange?.startDate,
      paymentDateEndDate: dateRange?.endDate,
      payOutStatusGuid: filters.payOutStatusGuid,
    }));

  };

  const [visibleColumns, setVisibleColumns] = useState(columns);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) => !selectedColumns.some((sCol) => sCol.field === col.field));
    setVisibleColumns(orderedSelectedColumns);
  };

  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const printButtons = [
//    { code: 'pdf', name: t('common.pdf'), icon: PdfIcon},
    { code: 'xlsx', name: t('common.excel'), icon: ExcelIcon},
//    { code: 'word', name: t('common.word'), icon: WordIcon},
    { code: 'csv', name: t('common.csv'), icon: CsvIcon},
  ];

  const handleSelect = (code) => {
    if(code == 'csv') exportDataToCSV(merchantReconciliationList, columns, selectOptions, 'merchantReconciliations');;
    if(code == 'xlsx') exportDataToExcel(merchantReconciliationList, columns, selectOptions, 'merchantReconciliations');
    if(code == 'pdf') exportPdf();
    setIsPrintOpen(false);
  };

  const header = (
    <div className='d-flex align-items-center'>
      <div className='flex-fill'>
        <div className="title">{t("Para Gönderim Raporları")}</div>
      </div>
      <div className='d-flex gap-3'>
        <div className="column-toggle-icon-container"> 
          <MultiSelect 
            value={columns.filter(col => !visibleColumns.some(vCol => vCol.field === col.field))} 
            options={columns} 
            optionLabel="header" 
            onChange={onColumnToggle} 
            display="chip"
            placeholder="Gizlenecek Kolonları Seçin"
            className='hidden-table-column'
            filter
          />
        </div>
        <div className='table-print-button'>
          <Dropdown className="print-selector" show={isPrintOpen} onToggle={(isPrintOpen) => setIsPrintOpen(isPrintOpen)}>
            <Dropdown.Toggle>
              <img src={printIcon} alt="" />
              <span>Raporu İndir</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {printButtons.map((print) => (
                <Dropdown.Item key={print.code} onClick={() => handleSelect(print.code)}>
                  <img src={print.icon} />
                  <span>{print.name}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (selectedDateFilter) {
      const dateRange = getDateRange(selectedDateFilter);
      dispatch(getMerchantReconciliationList({
        //merchantId: `${authData.merchantId}`,
        userName: user.userName,
        paymentDateStartDate: dateRange?.startDate,
        paymentDateEndDate: dateRange?.endDate,
        payOutStatusGuid: null,
      }));
    }
  }, [selectedDateFilter]);
  
  useEffect(() => {
    if (selectedRange) {
      dispatch(getMerchantReconciliationList({
        //merchantId: `${authData.merchantId}`,
        userName: user.userName,
        paymentDateStartDate: selectedRange[0],
        paymentDateEndDate: selectedRange[1],
        payOutStatusGuid: null,
      }));
    }
  }, [selectedRange]);

  return (
    <>
      <ConfirmDialog group="ConfirmDialogTemplating" />
      <div className="table-filter-area">
        <DateFilter 
          selectedFilter={selectedDateFilter}
          onFilterChange={(filter) => {
            setSelectedDateFilter(filter)
            setSelectedRange(null)
          }}
        />
        <div className="other-buttons">
          {/* <Button onClick={() => setFilterDialogVisible(true)}>
            <img src={ButtonIcon1} alt="" />
            <span>{t("common.advancedSearch")}</span>
          </Button> */}
          <Button onClick={() => setDialogVisible(true)}>
            <img src={ButtonIcon2} alt="" />
            <span>{t("common.byDate")}</span>
          </Button>
        </div>
      </div>
      <DateRangeDialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        onApply={(range) => {
          setSelectedDateFilter()
          setSelectedRange(range)
        }}
        initialRange={selectedRange}
      />
      <ReportsFilterDialog
        visible={filterDialogVisible}
        onHide={() => setFilterDialogVisible(false)}
        onFilter={handleFilter}
      />

      <Dialog
        header="Mutabakat Detayları"
        visible={reconciliationDialogVisible}
        style={{ width: '50vw', minWidth: 500 }}
        onHide={() => setReconciliationDialogVisible(false)}
        modal
      >
        {selectedRowData && (
          <div style={{ padding: '.5rem' }}>

            <div style={{ marginBottom: '.5rem' }}>
              <strong>Sipariş Numarası:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.orderId}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Ödeme ID:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.paymentId}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Kart No:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.cardNo}
            </div>
            {/* <div style={{ marginBottom: '.5rem' }}>
              <strong>Kart Tipi:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.cardTypeGuid}
            </div> */}
            <div style={{ marginBottom: '.5rem' }}>
              <strong>İşlem Tutarı:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.f004}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Pay Fac Komisyon Oranı:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.payFacCommissionRate}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Pay Fac Komisyon Tutarı:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.payFacCommissionAmount}
            </div>
            {/* <div style={{ marginBottom: '.5rem' }}>
              <strong>Taksit Tipi:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.installmentTypeGuid}
            </div> */}
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Taksit Sayısı:</strong> {selectedRowData?.merchantPayment?.merchantPaymentDetails[0]?.transactionProvisionSettle?.installmentCount}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Günsonu Tarihi:</strong> {formatDate(selectedRowData?.merchantPayment?.eodDate)}
            </div>
            <div style={{ marginBottom: '.5rem' }}>
              <strong>Ödeme Tarihi:</strong> {formatDate(selectedRowData?.merchantPayment?.paymentDate)}
            </div>
          </div>
        )}
      </Dialog>

      <div className="datatable-area-container">
        { !loading ? (
          <DataTable 
            header={header}
            value={filteredList || merchantReconciliationList} 
            paginator 
            rows={10} 
            rowsPerPageOptions={[5, 10, 25, 50]} 
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            emptyMessage={t('common.recordEmptyMessage')}
            currentPageReportTemplate={t('common.paginateText')}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            removableSort 
            dataKey="guid"
            scrollable
          >
          {/*
          <Column selectionMode="multiple" className='center-column' headerStyle={{ width: '3rem' }}></Column>
          */}
          {!loading && visibleColumns.map((col, index) => (
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
        ) : (
          <div className="custom-table-progress-spinner">
            <ProgressSpinner />
          </div>
        )}
      </div>
    </>
  )
}