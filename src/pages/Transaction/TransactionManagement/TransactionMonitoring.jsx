import { t } from 'i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getTransactionList, setTransactionListError } from '../../../store/slices/transaction-managment/transaction-monitoring/transactionListSlice';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import FilterDialog from '../../../components/Common/Table/FilterDialog';
import DateFilter from '../../../components/Common/Table/DateFilter';

import ButtonIcon1 from "@/assets/images/icons/advanced-search.svg";
import ButtonIcon2 from "@/assets/images/icons/by-date.svg";
import cancelButtonIcon from "@/assets/images/icons/cancel-button-1.svg";
import printIcon from "@/assets/images/icons/print-icon.svg";

import successDialogIcon from '@assets/images/icons/successDialogIcon.svg'
import dangerDialogIcon from '@assets/images/icons/dangerDialogIcon.svg'
import warningDialogIcon from '@assets/images/icons/warningDialogIcon.svg'
import smallLogo from '@assets/images/small-logo.png'

import PdfIcon from '@assets/images/icons/pdf.svg';
import ExcelIcon from '@assets/images/icons/excel.svg';
import WordIcon from '@assets/images/icons/word.svg';
import CsvIcon from '@assets/images/icons/csv.svg';

import { 
  getAuthorizationResponseCode,
  getTransactionType,
  getCardTypeName,
  getProvisionStatus,
  getTransactionNetwork,
  getInstallmentType,
  getPosEntryMode,
  getBankName,
  getCardAcceptorCountry,
  getSecurityLevelIndicator,
  getCurrencyName,
  getTransactionCurrency,
  formatDate,
  getDateRange,
  showDialog
 } from '../../../utils/helpers';

import { getAllAuthorizationResponseCode, getAllCardType, getAllCountry, getAllPosEntryModeDef, getAllProvisionStatusDef, getAllTransactionInstallmentTypeDef, getAllTransactionNetworkDef, getAllTransactionType, getCurrencyDef, getUsersPayFacIntegrationEnabledBankList } from '../../../store/slices/selectOptionSlice';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import DateRangeDialog from '../../../components/Common/Table/DateRangeDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'react-bootstrap';
import { exportDataToCSV, exportDataToExcel } from '../../../utils/exportUtils';

export default function TransactionMonitoring() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedProducts, setSelectedProducts] = useState(null);

  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [filteredList, setFilteredList] = useState(null);

  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRange, setSelectedRange] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const selectOptions = useSelector((state) => state.selectOptions);
  
  const { loading, error, success, transactionList, deleteSuccess } = useSelector((state) => state.transactionList);

  useEffect(() => {
    setSelectedProducts(null);
    dispatch(setTransactionListError(null));

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

  }, [])
  
  useEffect(()=> {
    console.log("transactionList99",transactionList)
  }, [transactionList])

  const columns = [
    { field: 'orderId', header: t('transaction.orderId'), sortable: true, className: "primary-text", },
    { 
      field: 'ravenTransactionTypeGuid', 
      header: t('transaction.transactionType'), 
      sortable: true,
      body: (rowData) => (
        <div className="logos-text">
          <i><img src={smallLogo} /></i>
          <span>{getTransactionType(rowData.ravenTransactionTypeGuid)}</span>
        </div>
      )
    },
    { field: 'insertDateTime', header: t('transaction.transactionDate'), sortable: true,
      body: (rowData) => formatDate(rowData.insertDateTime) },
    { field: 'paymentId', header: t('transaction.paymentId'), sortable: true },
    { field: 'bankUniqueReferenceNumber', header: t('transaction.bankUniqueReferenceNumber'), sortable: true },
    { field: 'transactionNetworkGuid', header: t('transaction.transactionNetwork'), sortable: true,
        body: (rowData) => getTransactionNetwork(rowData.transactionNetworkGuid) },
    { 
        field: 'ravenAuthorizationResponseCodeGuid', 
        header: t('transaction.responseCode'), 
        sortable: true,
        body: (rowData) => getAuthorizationResponseCode(rowData.ravenAuthorizationResponseCodeGuid)
    },
    { field: 'cardNo', header: t('transaction.cardNo'), sortable: true },
    { 
        field: 'cardTypeGuid', 
        header: t('transaction.cardType'), 
        sortable: true,
        body: (rowData) => getCardTypeName(rowData.cardTypeGuid)
    },
    { field: 'provisionStatusGuid', header: t('transaction.provisionStatus'), sortable: true,
      body: (rowData) => getProvisionStatus(rowData.provisionStatusGuid) },
    { field: 'preAuthAmount', header: t('transaction.preAuthAmount'), sortable: true },
    { field: 'installmentTypeGuid', header: t('transaction.installmentTypeGuid'), sortable: true,
      body: (rowData) => getInstallmentType(rowData.installmentTypeGuid) },
    { field: 'installmentCount', header: t('transaction.installmentCount'), sortable: true },
    { field: 'f004', header: t('transaction.transactionAmount'), sortable: true },
    { field: 'f005', header: t('transaction.settlementAmount'), sortable: true },
    { field: 'f013', header: t('transaction.transactionDate'), sortable: true },
    { field: 'posEntryModeGuid', header: t('transaction.posEntryModeGuid'), sortable: true,
        body: (rowData) => getPosEntryMode(rowData.posEntryModeGuid) },
    { 
        field: 'bankGuid', 
        header: t('transaction.bankName'), 
        sortable: true,
        body: (rowData) => getBankName(rowData.bankGuid)
    },
    { field: 'f038', header: t('transaction.authorizationNumber'), sortable: true },
    { field: 'f041', header: t('transaction.terminalId'), sortable: true },
    { field: 'f043cardAcceptorName', header: t('transaction.cardAcceptorName'), sortable: true },
    { field: 'f043cardAcceptorCityName', header: t('transaction.cardAcceptorCityName'), sortable: true },
    { field: 'f043cardAcceptorCountryCode', header: t('transaction.cardAcceptorCountryCode'), sortable: true,
        body: (rowData) => getCardAcceptorCountry(rowData.f043cardAcceptorCountryCode) },
    { field: 'paymentFacilatorId', header: t('transaction.paymentFacilatorId'), sortable: true },
    { field: 'subMerchantId', header: t('transaction.subMerchantId'), sortable: true },
    { field: 'pfSubMerchantId', header: t('transaction.pfSubMerchantId'), sortable: true },
    { field: 'securityLevelIndicator', header: t('transaction.securityLevelIndicator'), sortable: true,
        body: (rowData) => getSecurityLevelIndicator(rowData.securityLevelIndicator) },
    { field: 'f049', header: t('transaction.transactionCurrency'), sortable: true,
      body: (rowData) => getTransactionCurrency(rowData.f049) },
    { field: 'f050', header: t('transaction.exchangeCurrency'), sortable: true,
      body: (rowData) => getTransactionCurrency(rowData.f050) },
    { field: 'preauthorizationDate', header: t('transaction.preauthorizationDate'), sortable: true,
      body: (rowData) => formatDate(rowData.preauthorizationDate) },
    { field: 'preauthorizationClosingDateTime', header: t('transaction.preauthorizationClosingDateTime'), sortable: true,
      body: (rowData) => formatDate(rowData.preauthorizationClosingDateTime) },

    { 
      field: 'isCapture',
      header: t('transaction.isCapture'),
      sortable: true,
      className: "center-column",
      body: (rowData) => <InputSwitch checked={rowData.isCapture} />
    },

    { field: 'paymentTransactionMethod', header: t('transaction.paymentTransactionMethod'), sortable: true },

    {
        field: 'selection',
        header: t('common.actions'),
        alignFrozen: "right",
        frozen: true,
        body: (rowData) => (
            <div className="row-user-buttons">
                {/*<Button tooltip="Confirm to proceed" label="Save" />*/}

                <Link to={`/detail-transaction/${rowData.guid}`}>
                    <i className="pi pi-eye" style={{fontSize: '22px'}}></i>
                </Link>
                <div onClick={()=>confirmDeleteDialog(rowData.guid)}>
                  <img src={cancelButtonIcon} alt="" />
                </div>
            </div>
        ),
        className: "fixed-user-buttons"
    },
  ];

  // DELETE API
  const handleDeleteRecord = (guid) => {
    setTimeout(() => {
      confirmWarningDialog();
    }, 250);
    /*
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
      */
  }

  // DELETE FUNCTİON
  const confirmWarningDialog = (errorCode) => {
    showDialog(
      'warning',
      {
          title: t('messages.CancelDialogWarningTitle'),
          content: t('messages.CancelDialogWarningText'),
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
          title: t('messages.CancelDialogSuccessTitle'),
          content: t('messages.CancelDialogSuccessText'),
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
          title: t('messages.CancelDialogTitle'),
          content: `<a href="#">#${guid}</a> TX ID${t('messages.CancelDialogText')}`,
      },
      dangerDialogIcon,
      null,
      () => handleDeleteRecord(guid)
    );
  };

  const handleFilter = (filters) => {
    let filtered = [...transactionList];

    if (filters.cardFirst6) {
      filtered = filtered.filter(item => item.cardNo?.startsWith(filters.cardFirst6));
    }

    if (filters.cardLast4) {
      filtered = filtered.filter(item => item.cardNo?.slice(-4) === filters.cardLast4);
    }

    if (filters.cardHolder) {
      filtered = filtered.filter(item => item.cardHolder?.toLowerCase().includes(filters.cardHolder.toLowerCase()));
    }

    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      if (filters.amountOperator === 'eq') {
        filtered = filtered.filter(item => Number(item.f004) === amount);
      } else if (filters.amountOperator === 'gt') {
        filtered = filtered.filter(item => Number(item.f004) > amount);
      } else if (filters.amountOperator === 'lt') {
        filtered = filtered.filter(item => Number(item.f004) < amount);
      }
    }

    if (filters.paymentId) {
      filtered = filtered.filter(item => item.paymentId?.toLowerCase().includes(filters.paymentId.toLowerCase()));
    }
    if (filters.transactionNetworkGuid) {
      filtered = filtered.filter(item => item.transactionNetworkGuid === filters.transactionNetworkGuid);
    }
    if (filters.ravenTransactionTypeGuid) {
      filtered = filtered.filter(item => item.ravenTransactionTypeGuid === filters.ravenTransactionTypeGuid);
    }
    if (filters.cardTypeGuid) {
      filtered = filtered.filter(item => item.cardTypeGuid === filters.cardTypeGuid);
    }
    if (filters.startDate) {
      filtered = filtered.filter(item => new Date(item.insertDateTime) >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(item => new Date(item.insertDateTime) <= filters.endDate);
    }

    setFilteredList(filtered);
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
    if(code == 'csv') exportDataToCSV(transactionList, columns, selectOptions, 'transactions');;
    if(code == 'xlsx') exportDataToExcel(transactionList, columns, selectOptions, 'transactions');
    if(code == 'pdf') exportPdf();

    setIsPrintOpen(false);
  };

  const header = (
    <div className='d-flex align-items-center'>
      <div className='flex-fill'>
        <div className="title">{t("transaction.transactionTitle")}</div>
        <div className="text">{t("transaction.transactionText")}</div>
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
      dispatch(getTransactionList({
        userName: user.userName,
        transactionStartDate: dateRange?.startDate,
        transactionEndDate: dateRange?.endDate
      }));
    }
  }, [selectedDateFilter]);
  
  useEffect(() => {
    if (selectedRange) {
      dispatch(getTransactionList({
        userName: user.userName,
        transactionStartDate: selectedRange[0],
        transactionEndDate: selectedRange[1]
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