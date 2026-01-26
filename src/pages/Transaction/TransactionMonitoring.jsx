import { t } from 'i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cancelTransaction, getTransactionList, getTransactionSearchList, setTransactionListError } from '../../store/slices/transaction-managment/transactionListSlice';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import FilterDialog from '../../components/Common/Table/FilterDialog';
import DateFilter from '../../components/Common/Table/DateFilter';

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
  getSecurityLevelIndicator,
  getCurrencyName,
  getTransactionCurrency,
  formatDate,
  getDateRange,
  showDialog
 } from '../../utils/helpers';

import { getAllAuthorizationResponseCode, getAllCardType, getAllCountry, getAllPosEntryModeDef, getAllProvisionStatusDef, getAllTransactionInstallmentTypeDef, getAllTransactionNetworkDef, getAllTransactionType, getCurrencyDef, getUsersPayFacIntegrationEnabledBankList } from '../../store/slices/selectOptionSlice';
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import DateRangeDialog from '../../components/Common/Table/DateRangeDialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'react-bootstrap';
import { exportDataToCSV, exportDataToExcel } from '../../utils/exportUtils';
import { Tag } from 'primereact/tag';
import { useBackendPagination } from '../../utils/useBackendPagination';

export default function TransactionMonitoring({ pageType }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [transactionType, setTransactionType] = useState(pageType);

  const [selectedProducts, setSelectedProducts] = useState(null);

  const [filterDialogVisible, setFilterDialogVisible] = useState(false);

  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [selectedRange, setSelectedRange] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const selectOptions = useSelector((state) => state.selectOptions);
  
  const { loading, error, success, transactionList, deleteSuccess, filteredList } = useSelector((state) => state.transactionList);
  const authData = useSelector((state) => state.auth);



  // Backend Pagination Hook
  const {
    pageSize,
    pageNumber,
    sortField,
    sortOrder,
    totalRecords,
    first,
    handlePageChange,
    handleSortChange,
    resetPagination,
    setTotalRecords,
    getPaginationParams
  } = useBackendPagination({
    initialPageSize: 10,
    onPaginationChange: (params) => {
      // Pagination değiştiğinde API çağrısı
      const dateRange = getDateRange(selectedDateFilter);
      dispatch(getTransactionSearchList({
        merchantId: `${authData.merchantId}`,
        userName: user.userName,
        beginDate: selectedRange ? selectedRange[0] : dateRange?.startDate,
        endDate: selectedRange ? selectedRange[1] : dateRange?.endDate,
        transactionType: transactionType,
        ...params, // pagination parametreleri
      }));
    }
  });

  // API response'undan totalCount'u set et
  useEffect(() => {
    if (filteredList?.totalCount !== undefined) {
      setTotalRecords(filteredList.totalCount);
    }
  }, [filteredList, setTotalRecords]);

  const handleFilter = (filters) => {
    resetPagination(); // 1'e sıfırla
    
    const dateRange = getDateRange(selectedDateFilter);
    dispatch(getTransactionSearchList({
      merchantId: `${authData.merchantId}`,
      userName: user.userName,
      beginDate: selectedRange ? selectedRange[0] : dateRange?.startDate,
      endDate: selectedRange ? selectedRange[1] : dateRange?.endDate,
      transactionType: transactionType,
      ...getPaginationParams(), // Pagination parametreleri
      
      orderId: filters.paymentId,
      firstSixNumbersOfTheCard: filters.cardFirst6,
      lastFourNumbersOfTheCard: filters.cardLast4,
      installmentCount: null,
      lowAmount: filters.amountOperator == 'gt' ? filters.amount : null,
      highAmount: filters.amountOperator == 'lt' ? filters.amount : null,
      f043CardAcceptorName: filters.cardHolder
    }));
  };

  useEffect(() => {
    if (selectedDateFilter) {
      resetPagination(); // 1'e sıfırla
      const dateRange = getDateRange(selectedDateFilter);
      dispatch(getTransactionSearchList({
        merchantId: `${authData.merchantId}`,
        userName: user.userName,
        beginDate: dateRange?.startDate,
        endDate: dateRange?.endDate,
        transactionType: transactionType,
        ...getPaginationParams(),
      }));
    }
  }, [selectedDateFilter]);
  
  useEffect(() => {
    if (selectedRange) {
      resetPagination(); // 1'e sıfırla
      dispatch(getTransactionSearchList({
        merchantId: `${authData.merchantId}`,
        userName: user.userName,
        beginDate: selectedRange[0],
        endDate: selectedRange[1],
        transactionType: transactionType,
        ...getPaginationParams(), // Pagination parametreleri
      }));
    }
  }, [selectedRange]);





  useEffect(() => {
    setSelectedProducts(null);
    dispatch(setTransactionListError(null));
/*
    GEREKLI MI EMIN DEGILIM ?

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
  
  // useEffect(()=> {
  //   console.log("transactionList99",transactionList)
  // }, [transactionList])

  const columns = [
    { field: 'orderId', header: t('transaction.orderId2'), sortable: false, className: "primary-text", },
    { field: 'paymentMethod', header: t('transaction.paymentMethod'), sortable: false },
    { field: 'amount', header: t('transaction.amount'), sortable: true },
    { field: 'conversationId', header: t('transaction.conversationId'), sortable: false },
    { field: 'transactionType', header: t('transaction.transactionType2'), sortable: false,
      body: (rowData) => (
        <div className="logos-text">
          <i><img src={smallLogo} /></i>
          <span>{rowData.transactionType}</span>
        </div>
      )
    },
    
    { field: 'paymentChannel', header: t('transaction.paymentChannel'), sortable: false },
    { field: 'paymentMethod', header: t('transaction.paymentMethod2'), sortable: false },
    { field: 'currencyName', header: t('transaction.currencyName'), sortable: false },
    { field: 'bankName', header: t('transaction.bankName2'), sortable: false },
    { field: 'cardBank', header: t('transaction.cardBank'), sortable: false },
    { field: 'cardOrganization', header: t('transaction.cardOrganization'), sortable: false },
    { field: 'cardFirstSix', header: t('transaction.cardFirstSix'), sortable: false },
    { field: 'cardLastFour', header: t('transaction.cardLastFour'), sortable: false },
    { field: 'securityLevelIndicator', header: t('transaction.securityLevelIndicator2'), sortable: false },
    { field: 'installmentCount', header: t('transaction.installmentCount2'), sortable: false },
    { field: 'f043CardAcceptorName', header: t('transaction.f043CardAcceptorName'), sortable: false },

    { 
      field: 'transactionStatusCode', 
      header: t('transaction.transactionStatusCode'), 
      body: (rowData) => (
          rowData.transactionStatusCode === '00' ? <Tag severity="success" value={t('common.success')}></Tag> : <Tag severity="waiting" value={t('common.unsuccessful')}></Tag>
      )
  },
    { field: 'resultDesc', header: t('transaction.resultDesc'), sortable: false },
    { field: 'responseCode', header: t('transaction.responseCode2'), sortable: false },
    { field: 'transactionType', header: t('transaction.transactionTypeCode'), sortable: false },
    { field: 'mdStatus', header: t('transaction.mdStatus'), sortable: false },
    { field: 'authorizationResponseCode', header: t('transaction.authorizationResponseCode'), sortable: false },
    { field: 'hostRefNo', header: t('transaction.hostRefNo'), sortable: false },
    { field: 'transactionDate', header: t('transactionDetail.tableTitle6'), body: (rowData) => formatDate(rowData.transactionDate) },

    {
        field: 'selection',
        header: t('common.actions'),
        alignFrozen: "right",
        frozen: true,
        body: (rowData) => (
            <div className="row-user-buttons">
                {/*<Button tooltip="Confirm to proceed" label="Save" />*/}

                <Link to={`/detail-transaction/${rowData.orderId}`} state={{ prevUrl: location.pathname }}>
                    <i className="pi pi-eye" style={{fontSize: '22px'}}></i>
                </Link>
                {/*
                <div onClick={()=>confirmDeleteDialog(rowData)}>
                  <img src={cancelButtonIcon} alt="" />
                </div>
                */}
            </div>
        ),
        className: "fixed-user-buttons"
    },
  ];

  // DELETE API
  const handleDeleteRecord = (rowData) => {
    dispatch(cancelTransaction({
        merchantId: `${authData.merchantId}`,
        orderId: rowData.orderId,
        amount: rowData.amount,
        description: ""
    }))
    .unwrap()
    .then((result) => {
        setTimeout(() => {
            confirmSuccessDialog();
        }, 250);
    })
    .catch((error) => {
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

  const confirmDeleteDialog = (rowData) => {
    showDialog(
      'danger',
      {
          title: t('messages.CancelDialogTitle'),
          content: `<a href="#">#${rowData.orderId}</a> TX ID${t('messages.CancelDialogText')}`,
      },
      dangerDialogIcon,
      null,
      () => handleDeleteRecord(rowData)
    );
  };

  useEffect(() => {
    if (pageType) {
      setTransactionType(pageType);
    }
  }, [pageType])


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
            lazy={true}  // Backend pagination için
            paginator 
            rows={pageSize}
            first={first}
            totalRecords={totalRecords}
            onPage={handlePageChange}
            onSort={handleSortChange}
            sortField={sortField}
            sortOrder={sortOrder}
            header={header}
            value={filteredList?.transaction || transactionList?.transaction || []}
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