import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "primereact/carousel";
import { getMerchantProfileActivityLog } from "../../../store/slices/settings/userDefinitionSlice";
import { useDispatch, useSelector } from "react-redux";
import { Tag } from "primereact/tag";

import activityLogIcon from "@assets/images/icons/activity-log.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { formatDate } from "../../../utils/helpers";
import { Link } from "react-router-dom";

export default function DashboardActivityLog() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const authData = useSelector((state) => state.auth);
  const { loading, error, success, activityLogData } = useSelector(
    (state) => state.userDefinition
  );

  useEffect(() => {
    dispatch(
      getMerchantProfileActivityLog({
        merchantId: `${authData.merchantId}`,
        userGuid: authData.user.guid,
      })
    );
  }, []);

  useEffect(() => {
    console.log("activityLogData",activityLogData)
  }, [activityLogData])
  

  const activityLogHeader = (
    <div className="align-items-center d-flex justify-content-between">
      <div className="title">
        <img src={activityLogIcon} alt="" />
        <span>{t("dashboards.activityHistoryTitle")}</span>
      </div>
      <Link className="custom-button primary-button" to={`/user-definition`}>
        <span>{t('menu.allTransactions')}</span>
      </Link>
    </div>
  );

  const activityLogColumns = [
    {
      field: "loginDateTime",
      header: t("transactionDetail.tableTitle6"),
      className: "",
      body: (rowData) => formatDate(rowData.loginDateTime),
    },
    { field: "userGuid", header: t("settings.userGuid"), className: "" },
    { field: "ipAddress", header: t("settings.ipAddress"), className: "" },
    {
      field: "status",
      header: t("settings.status"),
      body: (rowData) =>
        rowData.status === "Success Login" ? (
          <Tag severity="success" value={rowData.status}></Tag>
        ) : (
          <Tag severity="waiting" value={rowData.status}></Tag>
        ),
    },
  ];

  return (
    <>
      <div className="log-table-box">
        <div className="detail-table-section">
          {!loading ? (
            <div className="datatable-area-container detail-page-table">
              <DataTable
                header={activityLogHeader}
                value={activityLogData || []}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage={t("common.recordEmptyMessage")}
                currentPageReportTemplate={t("common.paginateText")}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                removableSort
                scrollable
              >
                {activityLogColumns.map((col, index) => (
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
