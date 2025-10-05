import { t } from 'i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { cancelTransaction, getTransactionList, getTransactionReceipt, getTransactionSearchList, setTransactionListError } from '../../../store/slices/transaction-managment/transactionListSlice';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import FilterDialog from '../../../components/Common/Table/FilterDialog';
import DateFilter from '../../../components/Common/Table/DateFilter';

import ButtonIcon1 from "@/assets/images/icons/advanced-search.svg";
import ButtonIcon2 from "@/assets/images/icons/by-date.svg";
import printIcon from "@/assets/images/icons/print-icon.svg";

import smallLogo from '@assets/images/small-logo.png'

import ExcelIcon from '@assets/images/icons/excel.svg';
import CsvIcon from '@assets/images/icons/csv.svg';
import { Tooltip } from 'primereact/tooltip';

import { 
  formatDate,
  getDateRange
 } from '../../../utils/helpers';

import { getAllAuthorizationResponseCode, getAllCardType, getAllCountry, getAllPosEntryModeDef, getAllProvisionStatusDef, getAllTransactionInstallmentTypeDef, getAllTransactionNetworkDef, getAllTransactionType, getCurrencyDef, getUsersPayFacIntegrationEnabledBankList } from '../../../store/slices/selectOptionSlice';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import DateRangeDialog from '../../../components/Common/Table/DateRangeDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'react-bootstrap';
import { exportDataToCSV, exportDataToExcel } from '../../../utils/exportUtils';
import { Tag } from 'primereact/tag';
import TransactionReceipt, { downloadReceiptDirect } from '../../../components/Common/Table/TransactionReceipt';

export default function InvoiceReports() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState(null);

  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [receiptDialogVisible, setReceiptDialogVisible] = useState(false);
  
  const [isDirectDownload, setIsDirectDownload] = useState(false);
  

  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRange, setSelectedRange] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const selectOptions = useSelector((state) => state.selectOptions);
  
  const { loading, error, success, transactionList, deleteSuccess, filteredList, transactionReceiptData } = useSelector((state) => state.transactionList);
  const authData = useSelector((state) => state.auth);

  useEffect(() => {
    setSelectedProducts(null);
    dispatch(setTransactionListError(null));
/*
    dispatch(getCurrencyDef());
    dispatch(getAllTransactionNetworkDef());
    dispatch(getAllAuthorizationResponseCode());
    dispatch(getAllTransactionType());
    dispatch(getAllCardType());
    dispatch(getAllProvisionStatusDef());
    dispatch(getAllTransactionInstallmentTypeDef());
    dispatch(getAllPosEntryModeDef());
    dispatch(getUsersPayFacIntegrationEnabledBankList(user.userName));
    dispatch(getAllCountry());
*/
  }, [])
  
  const columns = [
    { field: 'orderId', header: t('transaction.orderId2'), sortable: true, className: "primary-text text-center", },
    { field: 'amount', header: t('transaction.amount'), sortable: true },
    { field: 'currencyName', header: t('transaction.currencyName'), sortable: true },
    { field: 'bankName', header: t('transaction.bankName2'), sortable: true },
    { field: 'tableName', header: t('Table_Name'), sortable: true },
    
    { field: 'transactionDate', header: t('transaction.refundTransactionColumn5'), className: "center-column", sortable: true, body: (rowData) => formatDate(rowData.transactionDate) },
    
    {
        field: 'selection',
        header: t('common.actions'),
        alignFrozen: "right",
        frozen: true,
        body: (rowData) => (
            <div className="row-user-buttons">
                <Button tooltip="Görüntüle" className='p-tooltip-button' tooltipOptions={{ position: 'bottom' }} onClick={()=>transactionReceipt(rowData)}><i className="pi pi-eye" style={{fontSize: '22px'}}></i></Button>
                <Button tooltip="İndir" className='p-tooltip-button' tooltipOptions={{ position: 'bottom' }} onClick={()=>downloadTransactionReceipt(rowData)}><i className="fa-regular fa-file-lines" style={{fontSize: '20px'}}></i></Button>
            </div>
        ),
        className: "fixed-user-buttons"
    },
  ];

  const handleFilter = (filters) => {
    console.log("handleFilter filters",filters)

    const dateRange = getDateRange(selectedDateFilter);
    dispatch(getTransactionSearchList({
      merchantId: `${authData.merchantId}`,
      beginDate: selectedRange ? selectedRange[0] : dateRange?.startDate,
      endDate: selectedRange ? selectedRange[1] : dateRange?.endDate,
      transactionType: null,

      orderId: filters.paymentId,
      firstSixNumbersOfTheCard: filters.cardFirst6,
      lastFourNumbersOfTheCard: filters.cardLast4,

      installmentCount: null,

      lowAmount: filters.amountOperator == 'gt' ? filters.amount : null, // En düşük tutar
      highAmount: filters.amountOperator == 'lt' ? filters.amount : null, // En yüksek tutar

      f043CardAcceptorName: filters.cardHolder
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
    if(code == 'csv') exportDataToCSV(filteredList, columns, selectOptions, 'transactions');;
    if(code == 'xlsx') exportDataToExcel(filteredList, columns, selectOptions, 'transactions');
    if(code == 'pdf') exportPdf();

    setIsPrintOpen(false);
  };

  const header = (
    <div className='d-flex align-items-center'>
      <div className='flex-fill'>
        <div className="title">{t("Dekontlarım")}</div>
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
      dispatch(getTransactionSearchList({
        merchantId: `${authData.merchantId}`,
        userName: user.userName,
        beginDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        transactionType: null,
      }));
    }
  }, [selectedDateFilter]);
  
  useEffect(() => {
    if (selectedRange) {
      dispatch(getTransactionSearchList({
        merchantId: `${authData.merchantId}`,
        userName: user.userName,
        beginDate: selectedRange[0],
        endDate: selectedRange[1],
        transactionType: null,
      }));
    }
  }, [selectedRange]);


  const transactionReceipt =(item) => {
    dispatch(getTransactionReceipt({
      merchantId: `${authData.merchantId}`,
      orderId: item.orderId,
    }));
    setIsDirectDownload(false)
  }
  
  const downloadTransactionReceipt =(item) => {
    dispatch(getTransactionReceipt({
      merchantId: `${authData.merchantId}`,
      orderId: item.orderId,
    }));
    setIsDirectDownload(true)
  }

  useEffect(()=> {
    console.log("transactionReceiptData || 99",transactionReceiptData);
    if(!error && transactionReceiptData && !isDirectDownload){
      setReceiptDialogVisible(true);
    } else if(isDirectDownload) {
      downloadReceiptDirect(transactionReceiptData);
      setIsDirectDownload(false)
    }
  }, [transactionReceiptData])

  return (
    <>
      <ConfirmDialog group="ConfirmDialogTemplating" />

      <TransactionReceipt
        modalData={transactionReceiptData}
        visible={receiptDialogVisible}
        onHide={() => setReceiptDialogVisible(false)}
      />

      <div className="table-filter-area">
        <DateFilter 
          selectedFilter={selectedDateFilter}
          onFilterChange={(filter) => {
            setSelectedDateFilter(filter)
            setSelectedRange(null)
          }}
        />
        <div className="other-buttons">
          <Button onClick={() => setFilterDialogVisible(true)}>
            <img src={ButtonIcon1} alt="" />
            <span>{t("common.advancedSearch")}</span>
          </Button>
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
      <FilterDialog
        visible={filterDialogVisible}
        onHide={() => setFilterDialogVisible(false)}
        onFilter={handleFilter}
      />
      <div className="datatable-area-container">
        { !loading ? (
          <DataTable 
            header={header}
            value={filteredList || transactionList} 
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
                headerClassName="center-column"
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