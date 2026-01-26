import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Tag } from "primereact/tag";

import activityLogIcon from "@assets/images/icons/activity-log.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { formatDate, getDateRange } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import { getTransactionList } from "../../../store/slices/transaction-managment/transactionListSlice";

export default function DashboardLastTransaction() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const authData = useSelector((state) => state.auth);
  const { loading, error, success, transactionList, deleteSuccess, filteredList } = useSelector((state) => state.transactionList);
  

  useEffect(() => {
    const dateRange = getDateRange('all');
    dispatch(getTransactionList({
      merchantId: `${authData.merchantId}`,
      userName: authData.user.userName,
      beginDate: dateRange?.startDate,
      endDate: dateRange?.endDate,
      transactionType: null,
    }));
  }, []);

  useEffect(() => {
    console.log("transactionList",transactionList)
  }, [transactionList])
  

  const activityLogHeader = (
    <div className="align-items-center d-flex justify-content-between">
      <div className="title">
        <img src={activityLogIcon} alt="" />
        <span>{t("dashboards.activityHistoryTitle")}</span>
      </div>
      <Link className="custom-button primary-button" to={`/transaction-monitoring`}>
        <span>{t('menu.allTransactions')}</span>
      </Link>
    </div>
  );

  const columns = [
    { field: 'orderId', header: t('transaction.orderId2'), sortable: false, className: "primary-text", },
    { field: 'f043CardAcceptorName', header: t('transaction.f043CardAcceptorName'), sortable: false },
    { field: 'amount', header: t('transaction.amount'), sortable: true },
    { field: 'currencyName', header: t('transaction.currencyName'), sortable: false },

    {
      field: "transactionStatusCode",
      header: t("transaction.transactionStatusCode"),
      body: (rowData) =>
        rowData.transactionStatusCode === "00" ? (
          <Tag severity="success" value={t('common.success')}></Tag>
        ) : (
          <Tag severity="waiting" value={t('common.unsuccessful')}></Tag>
        ),
    },
    
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

  return (
    <>
      <div className="log-table-box">
        <div className="detail-table-section">
          {!loading ? (
            <div className="datatable-area-container detail-page-table">
              <DataTable
                lazy={true}
                header={activityLogHeader}
                value={transactionList?.transaction || []}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t("common.recordEmptyMessage")}
                currentPageReportTemplate={t("common.paginateText")}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                removableSort
                scrollable
              >
                {columns.map((col, index) => (
                  <Column
                    className="center-column"
                    key={index}
                    {...col}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  />
                ))}
              </DataTable>
            </div>
          ) : (
            <div className="custom-table-progress-spinner">
              <ProgressSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
