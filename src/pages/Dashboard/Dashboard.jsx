import { Container, Row, Col, Card } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";

import ButtonIcon2 from "@/assets/images/icons/by-date.svg";
import TransactionIcon1 from "@/assets/images/icons/AllTransaction.svg";
import TransactionIcon2 from "@/assets/images/icons/RefundCancellation.svg";
import TransactionIcon3 from "@/assets/images/icons/ChargeBack.svg";
import TransactionDashboardIcon from "@/assets/images/icons/transaction-dashboard-icon.svg";
import SliderBannerImage from "@/assets/images/slider-banner.jpg";

import DateRangeDialog from "../../components/Common/Table/DateRangeDialog";
import ReportsFilterDialog from "../../components/Common/Table/ReportsFilterDialog";
import DateFilter from "../../components/Common/Table/DateFilter";

import { formatDate, getDateRange } from "../../utils/helpers";
import {
  getDashboard,
  getGraphicData,
  setDashboardError,
} from "../../store/slices/dashboard/dashboardSlice";
import TransactionBox from "./components/TransactionBox";
import StatisticsChart from "./components/StatisticsChart";
import BannerSlider from "./components/BannerSlider";
import DashboardLinkPayment from "./components/DashboardLinkPayment";
import DashboardActivityLog from "./components/DashboardActivityLog";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);

  // const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const [selectedRange, setSelectedRange] = useState(null);

  const [currencyGuid, setCurrencyGuid] = useState("949");

  const { loading, error, success, data, graphicData, deleteSuccess } =
    useSelector((state) => state.homeDashboard);

  useEffect(() => {
    dispatch(setDashboardError(null));
  }, []);

  useEffect(() => {
    dispatch(getGraphicData());

    console.log("Homepage Dashboard Data", data);
  }, [data]);

  // const handleFilter = (filters) => {
  //   const dateRange = getDateRange(selectedDateFilter);
  //   // dispatch(getMerchantReconciliationList({
  //   //   //merchantId: `${authData.merchantId}`,
  //   //   userName: user.userName,
  //   //   paymentDateStartDate: dateRange?.startDate,
  //   //   paymentDateEndDate: dateRange?.endDate,
  //   //   payOutStatusGuid: filters.payOutStatusGuid,
  //   // }));
  // };

  useEffect(() => {
    if (selectedDateFilter) {
      const dateRange = getDateRange(selectedDateFilter);
      dispatch(
        getDashboard({
          merchantId: `${authData.merchantId}`,
          currencyCode: currencyGuid,
          beginDate: dateRange?.startDate,
          endDate: dateRange?.endDate,
        })
      );
    }
  }, [selectedDateFilter, currencyGuid]);

  useEffect(() => {
    if (selectedRange) {
      dispatch(
        getDashboard({
          merchantId: `${authData.merchantId}`,
          currencyCode: currencyGuid,
          beginDate: selectedRange[0],
          endDate: selectedRange[1],
        })
      );
    }
  }, [selectedRange]);

  const sliderImages = [
    {
      image: SliderBannerImage,
      link: "#"
    },
    {
      image: SliderBannerImage,
      link: "#"
    },
    {
      image: SliderBannerImage,
      link: "#"
    },
  ];

  return (
    <>
    {!loading ? (
      <div className="dashboard-section-wrapper">
        <div className="table-filter-area">
          <DateFilter
            selectedFilter={selectedDateFilter}
            onFilterChange={(filter) => {
              setSelectedDateFilter(filter);
              setSelectedRange(null);
            }}
            showCurrencyFilter={true}
            onCurrencyChange={(e) => setCurrencyGuid(e)}
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
          <DateRangeDialog
            visible={dialogVisible}
            onHide={() => setDialogVisible(false)}
            onApply={(range) => {
              setSelectedDateFilter();
              setSelectedRange(range);
            }}
            initialRange={selectedRange}
          />
          {/* <ReportsFilterDialog
            visible={filterDialogVisible}
            onHide={() => setFilterDialogVisible(false)}
            onFilter={handleFilter}
          /> */}
        </div>
        <div className="section">
          {data && data.transactions && (
            <div className="transaction-box-container">
              {data.transactions
                .filter((item) => item.transactionTypeCode !== "0500")
                .map((item, index) => {
                  const icons = [
                    TransactionIcon1,
                    TransactionIcon2,
                    TransactionIcon3,
                  ];
                  const selectedIcon = icons[index % 3];
                  return (
                    <TransactionBox
                      key={index}
                      item={item}
                      icon={selectedIcon}
                      currencyName={currencyGuid}
                      className="item-box"
                    />
                  );
                })}
            </div>
          )}
        </div>
        {/* <div className="section">
          <div className="row">
            <div className="col-lg">
              {graphicData && <StatisticsChart graphicData={graphicData} />}
            </div>
            <div className="col-lg-auto">
              <div className="dashboard-info-box">
                <i>
                  <img src={TransactionDashboardIcon} alt="" />
                </i>
                <div>
                  <div className="title">{t("dashboards.infoTitle")}</div>
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: t("dashboards.infoText") }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="section">
          <div className="row">
            <div className="col-lg-auto">
              <BannerSlider images={sliderImages} />
            </div>
            <div className="col-lg">
              <div className="dashboard-link-datatable">
                <DashboardLinkPayment />
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <DashboardActivityLog />
        </div>
      </div>
    ) : (
      <div className="custom-table-progress-spinner">
        <ProgressSpinner />
      </div>
    )}
    </>
  );
}
