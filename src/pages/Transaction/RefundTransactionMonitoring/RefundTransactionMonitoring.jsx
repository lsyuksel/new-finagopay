import { t } from 'i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getRefundTransactionList, setRefundTransactionListError } from '../../../store/slices/transaction-managment/refund-transaction-monitoring/refundTransactionListSlice';

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
import { Tag } from 'primereact/tag';

export default function RefundTransactionMonitoring() {
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
    
    const { loading, error, success, refundTransactionList, deleteSuccess } = useSelector((state) => state.refundTransactionList);
  
    useEffect(() => {
      setSelectedProducts(null);
      dispatch(setRefundTransactionListError(null));
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
      { field: 'field1', header: t('transaction.refundTransactionColumn1'), sortable: true, className: "primary-text center-column", },
      
      { 
        field: 'field2', 
        header: t('transaction.refundTransactionColumn2'),
        sortable: true, 
        body: (rowData) => (
            rowData.field2 === 'İade' ? 
                <div style={{ fontWeight: '600', color: '#667085' }}>{rowData.field2}</div> :
            rowData.field2 === 'İptal' ? 
                <div style={{ fontWeight: '600', color: '#F04438' }}>{rowData.field2}</div> :
                <div style={{ fontWeight: '600', color: '#F04438' }}>{rowData.field2}</div>
        )
      },

      { field: 'field3', header: t('transaction.refundTransactionColumn3'), className: "price-column center-column", sortable: true, },
      { field: 'field4', header: t('transaction.refundTransactionColumn4'), sortable: true, },
      { field: 'field5', header: t('transaction.refundTransactionColumn5'), sortable: true, },

      { 
        field: 'field6', 
        header: t('transaction.refundTransactionColumn6'),
        sortable: true, 
        body: (rowData) => (
            rowData.field6 === 'Tamamlandı' ? 
                <Tag severity="success" value={rowData.field6}></Tag> :
            rowData.field6 === 'Devam Ediyor' ? 
                <Tag severity="waiting" value={rowData.field6}></Tag> :
                <Tag severity="waiting" value={rowData.field6}></Tag>
        )
      },
  
      {
          field: 'selection',
          header: t('common.actions'),
          alignFrozen: "right",
          frozen: true,
          body: (rowData) => (
              <div className="row-user-buttons">
                  {/*<Button tooltip="Confirm to proceed" label="Save" />*/}
  
                  <Link to={`/detail-refund-transaction/${rowData.guid}`}>
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
      let filtered = [...refundTransactionList];
  
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
      { code: 'xlsx', name: t('common.excel'), icon: ExcelIcon},
      { code: 'csv', name: t('common.csv'), icon: CsvIcon},
    ];
  
    const handleSelect = (code) => {
      if(code == 'csv') exportDataToCSV(refundTransactionList, columns, selectOptions, 'refundTransactions');;
      if(code == 'xlsx') exportDataToExcel(refundTransactionList, columns, selectOptions, 'refundTransactions');
      if(code == 'pdf') exportPdf();
  
      setIsPrintOpen(false);
    };
  
    const header = (
      <div className='d-flex align-items-center'>
        <div className='flex-fill'>
          <div className="title">{t("transaction.refundTransactionTitle")}</div>
          <div className="text">{t("transaction.refundTransactionText")}</div>
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
        dispatch(getRefundTransactionList({
          userName: user.userName,
          transactionStartDate: dateRange?.startDate,
          transactionEndDate: dateRange?.endDate
        }));
      }
    }, [selectedDateFilter]);
    
    useEffect(() => {
      if (selectedRange) {
        dispatch(getRefundTransactionList({
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
              value={filteredList || refundTransactionList} 
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
                  headerClassName='center-column'
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