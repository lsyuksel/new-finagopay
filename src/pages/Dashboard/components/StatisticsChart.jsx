import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';

export default function StatisticsChart({ graphicData }) {
  const { t } = useTranslation();

  // Tüm serileri sakla
  const allSeries = [
    {
      name: t('dashboards.graphicTitle1'),
      data: graphicData.allTransactions || [],
      color: '#00B69B'
    },
    {
      name: t('dashboards.graphicTitle2'),
      data: graphicData.suspiciousTransactions || [],
      color: '#FF9F43'
    },
    {
      name: t('dashboards.graphicTitle3'),
      data: graphicData.refundTransactions || [],
      color: '#F04438'
    },
    {
      name: t('dashboards.graphicTitle4'),
      data: graphicData.disputes || [],
      color: '#9D9D9D'
    }
  ];

  // Aktif serileri yönet
  const [activeSeries, setActiveSeries] = useState([0, 1, 2, 3]); // Başlangıçta tümü aktif

  // Aktif serilere göre chart serilerini oluştur
  const chartSeries = activeSeries.map(index => ({
    name: allSeries[index].name,
    data: allSeries[index].data
  }));

  // Aktif serilere göre renkleri ayarla
  const chartColors = activeSeries.map(index => allSeries[index].color);

  const baseChartOptions = {
    chart: {
      type: 'area',
      height: 320,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      events: {
        legendClick: function(chartContext, seriesIndex, config) {
          // ApexCharts legend tıklamasını devre dışı bırak
          return false;
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 80]
      }
    },
    xaxis: {
      categories: graphicData.months,
      labels: {
        style: {
          colors: '#667085',
          fontSize: '13px',
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif'
        },
        offsetX: 0,
        offsetY: 0
      },
      offsetX: 0,
      offsetY: 3
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          if (val >= 1000000) {
            return '₺' + (val / 1000000).toFixed(1) + 'M';
          } else if (val >= 1000) {
            return '₺' + (val / 1000).toFixed(0) + 'k';
          }
          return '₺' + val;
        },
        style: {
          colors: '#667085',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      min: 0,
      max: 1400000,
      tickAmount: 7
    },
    legend: {
      show: false // Custom legend kullanacağız
    },
    grid: {
      borderColor: '#EBEBEB',
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      style: {
        fontFamily: 'Inter, sans-serif'
      },
      y: {
        formatter: function (val) {
          return '₺' + val.toLocaleString('tr-TR');
        }
      }
    }
  };

  // Seri filtreleme fonksiyonları
  const handleShowAll = () => {
    setActiveSeries([0, 1, 2, 3]);
  };

  const handleToggleSeries = (index) => {
    if (activeSeries.length === 1 && activeSeries[0] === index) {
      // Eğer sadece bu seri aktifse, tümünü göster
      handleShowAll();
    } else {
      // Sadece seçilen seriyi göster
      setActiveSeries([index]);
    }
  };

  // useEffect(() => {
  //   console.log("graphic data", graphicData);
  // }, [graphicData]);

  // Chart options'ı güncelle (renkler dinamik olmalı)
  const chartOptions = {
    ...baseChartOptions,
    colors: chartColors
  };

  return (
    <div className="apex-chart-container">
        <div className="title-area">
          <div>
            <div className="title">İstatistikler</div>
            <div className="custom-legend-area">
              {allSeries.map((series, index) => {
                const isActive = activeSeries.includes(index) && activeSeries.length === 1;
                return (
                  <div
                    key={index}
                    onClick={() => handleToggleSeries(index)}
                    className={isActive ? 'active' : ''}
                    style={isActive ? {color: series.color} : {}}
                  >
                    <i style={{backgroundColor: series.color}}></i>
                    <span>
                      {series.name}
                      <i style={{backgroundColor: series.color}}></i>
                    </span>
                  </div>
                );
              })}
              <div
                onClick={handleShowAll}
                className={`all-button ${activeSeries.length === 4 && 'active'}`}
              >
                <i></i>
                <span>
                  {t('common.all')}
                  <i></i>
                </span>
              </div>
            </div>
          </div>
          <div className="text">Genel istatistik bilgilerini içerir</div>
        </div>

        <Chart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={320}
        />
    </div>
  );
}
