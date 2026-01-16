import { useTranslation } from 'react-i18next';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMerchantCommissionList, getPayFacCommissionBankList, updateMerchantCommissionDefList, insertMerchantCommissionDefList, setMerchantCommissionError } from '../../store/slices/settings/merchantCommissionSlice';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { ConfirmDialog } from 'primereact/confirmdialog';
import dangerDialogIcon from '@assets/images/icons/dangerDialogIcon.svg'
import { showDialog } from '../../utils/helpers';

const MerchantCommissionList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, bankGroups, bankList, originalBankData } = useSelector((state) => state.merchantCommission);
  
  const [bankEditableData, setBankEditableData] = useState({});
  const [bankToggles, setBankToggles] = useState({});
  const [savingBanks, setSavingBanks] = useState({}); // Her banka için ayrı loading state
  
  useEffect(() => {
    if (bankGroups?.length > 0 && originalBankData?.length > 0) {
      const newEditableData = {};
      const newToggles = {};
      
      bankGroups.forEach((bank) => {
        const bankKey = bank.bankGuid;
        newEditableData[bankKey] = bank.installments;
        
        // payOutTypeGuid'e göre toggle durumunu ayarla
        // payOutTypeGuid: 0 → toggle aktif (true)
        // payOutTypeGuid: 3 → toggle pasif (false)
        const originalBank = originalBankData.find(item => item.bankGuid === bankKey);
        const payOutTypeGuid = originalBank?.payOutTypeGuid;
        newToggles[bankKey] = payOutTypeGuid === 0;
      });
      
      setBankEditableData(newEditableData);
      setBankToggles(newToggles);
    }
  }, [bankGroups, originalBankData]);

  useEffect(() => {
    dispatch(setMerchantCommissionError(null));
    dispatch(getMerchantCommissionList({
      userName: user.userName,
    }));
    dispatch(getPayFacCommissionBankList(user.userName));
  }, []);

  const merchantRateEditor = (bankKey) => (options) => {
    const handleValueChange = (e) => {
      const newVal = e.value !== null && e.value !== undefined ? Number(e.value) : 0;
      
      if (options.editorCallback) {
        options.editorCallback(newVal);
      }
      
      setBankEditableData(prevBankData => {
        const bankData = prevBankData[bankKey] || [];
        if (!bankData?.length || !options.rowData) {
          return prevBankData;
        }
        
        const rowKey = options.rowData.merchantCommissionInstallmentGuid || options.rowData.installmentId;
        const rowIndex = bankData.findIndex(item => {
          const matchKey = item.merchantCommissionInstallmentGuid || item.installmentId;
          return matchKey === rowKey;
        });
        
        if (rowIndex === -1) {
          return prevBankData;
        }
        
        const updatedBankData = [...bankData];
        updatedBankData[rowIndex] = {
          ...updatedBankData[rowIndex],
          merchantInstallmentRate: newVal
        };
        
        return {
          ...prevBankData,
          [bankKey]: updatedBankData
        };
      });
    };
    
    return (
      <InputNumber
        value={options.value || 0}
        onValueChange={handleValueChange}
        mode="decimal"
        minFractionDigits={2}
        maxFractionDigits={2}
        min={0}
        max={100}
        style={{ width: '100%' }}
        autoFocus
        useGrouping={false}
      />
    );
  };

  const getColumns = (bankKey, isEditable) => [
    { 
      field: 'installmentCount', 
      header: t('settings.installmentCount'), 
      sortable: false,
      width: '100px',
      body: (rowData) => {
        if (rowData.installmentId == 1) {
          return t('settings.singlePayment');
        }
        return rowData.installmentId || '-';
      }
    },
    { 
      field: 'payFacInstallmentRate', 
      header: t('settings.morParaCommissionRate'), 
      sortable: false,
      width: '120px',
      body: (rowData) => `%${(rowData.payFacInstallmentRate || 0).toFixed(2)}`
    },
    { 
      field: 'merchantInstallmentRate', 
      header: t('settings.reflectToMerchantCommission'), 
      sortable: false,
      width: '170px',
      editor: isEditable ? (options) => {
        const isFirstRow = options.rowData?.installmentId == 1;
        
        if (isFirstRow) {
          return (
            <div 
              style={{ 
                padding: '8px',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {`%${(options.value || 0).toFixed(2)}`}
            </div>
          );
        }
        return merchantRateEditor(bankKey)(options);
      } : undefined,
      body: (rowData) => `%${(rowData.merchantInstallmentRate || 0).toFixed(2)}`
    },
    { 
      field: 'tutar', 
      header: t('settings.amount'), 
      sortable: false,
      width: '150px',
      body: (rowData) => {
        const total = 100 + (rowData.merchantInstallmentRate || 0);
        return `${total.toFixed(2)} TL`;
      }
    },
    { 
      field: 'aktarilacakTutar', 
      header: t('settings.transferToAccount'), 
      sortable: false,
      width: '180px',
      body: (rowData) => {
        const payFacRate = rowData.payFacInstallmentRate || 0;
        const merchantRate = rowData.merchantInstallmentRate || 0;
        const transfer = (100 + merchantRate) - payFacRate - (merchantRate * payFacRate * 0.01);
        return <span>{transfer.toFixed(2)} TL</span>;
      }
    },
  ];

  const handleToggleChange = (bankKey) => {
    setBankToggles(prev => ({
      ...prev,
      [bankKey]: !prev[bankKey]
    }));
  };

  const confirmDialog = (bankGuid) => {
      // showDialog(
      // 'danger',
      // {
      //     title: t('transactionDetail.CancelDialogSuccessTitle'),
      //     content: t('transactionDetail.CancelDialogSuccessText'),
      // },
      // dangerDialogIcon,
      // null,
      // () => handleSaveBank(bankGuid)
      // );
      handleSaveBank(bankGuid)
  };

  const handleSaveBank = async (bankGuid) => {
    try {
      setSavingBanks(prev => ({ ...prev, [bankGuid]: true }));
      
      const originalBank = originalBankData.find(
        item => item.bankGuid === bankGuid
      );

      if (!originalBank) {
        setSavingBanks(prev => ({ ...prev, [bankGuid]: false }));
        return;
      }

      // Toggle durumunu kontrol et
      const isToggleActive = bankToggles[bankGuid] || false;
      
      // Toggle durumuna göre payOutTypeGuid belirle
      // Toggle açık (true) → payOutTypeGuid: 0 (UPDATE) → status: true
      // Toggle kapalı (false) → payOutTypeGuid: 0 (UPDATE) → status: false
      // Toggle açık ve payOutTypeGuid başlangıçta 3 ise → payOutTypeGuid: 3 (INSERT) → status: true
      const originalPayOutTypeGuid = originalBank.payOutTypeGuid;
      let payOutTypeGuid;
      
      if (isToggleActive) {
        // Toggle açık
        if (originalPayOutTypeGuid === 3) {
          // İlk kez açılıyor, INSERT yap
          payOutTypeGuid = 3;
        } else {
          // Zaten açıktı, UPDATE yap
          payOutTypeGuid = 0;
        }
      } else {
        // Toggle kapalı → her zaman UPDATE
        payOutTypeGuid = 0;
      }
      
      // Toggle durumuna göre status belirle
      // Toggle açık → status: true
      // Toggle kapalı → status: false
      const status = isToggleActive;

      const updatedInstallments = bankEditableData[bankGuid] || bankGroups.find(b => b.bankGuid === bankGuid)?.installments || [];
      
      const merchantCommissionInstallmentDefs = updatedInstallments.map((installment, index) => {
        const merchantRate = installment.merchantInstallmentRate || 0;
        const payFacRate = parseFloat(installment.payFacInstallmentRate || 0);
        
        const reflectToMerchantCommissionRate = merchantRate;
        const installmentRate = merchantRate;
        const reflectToMerchantCommissionAmount = 100 + merchantRate;
        const transferToAccountAmountTL = (100 + merchantRate) - payFacRate - (merchantRate * payFacRate * 0.01);
        
        return {
          ...installment,
          payFacInstallmentRate: String(installment.payFacInstallmentRate || 0),
          updateUser: user.userName,
          id: index,
          guid: installment.merchantCommissionInstallmentGuid || 0,
          reflectToMerchantCommissionRate: reflectToMerchantCommissionRate.toFixed(2),
          installmentRate: installmentRate.toFixed(2),
          reflectToMerchantCommissionAmount: reflectToMerchantCommissionAmount.toFixed(2),
          transferToAccountAmountTL: transferToAccountAmountTL.toFixed(2)
        };
      });

      const requestData = {
        guid: originalBank.merchantCommissionGuid || 0,
        payFacGuid: originalBank.payFacGuid,
        bankGuid: bankGuid,
        payFacCommissionGuid: originalBank.payFacCommissionGuid || "",
        payOutTypeGuid: payOutTypeGuid,
        valueDateDayCount: originalBank.valueDateDayCount || "",
        status: status,
        merchantCommissionInstallmentDefs: merchantCommissionInstallmentDefs,
        updateUser: user.userName,
        userName: user.userName
      };

      // payOutTypeGuid'e göre INSERT veya UPDATE seç
      if (payOutTypeGuid === 3) {
        // INSERT metodu
        await dispatch(insertMerchantCommissionDefList(requestData)).unwrap();
      } else {
        // UPDATE metodu
        await dispatch(updateMerchantCommissionDefList(requestData)).unwrap();
      }

      dispatch(getMerchantCommissionList({
        userName: user.userName,
      }));

      setSavingBanks(prev => ({ ...prev, [bankGuid]: false }));

    } catch (error) {
      setSavingBanks(prev => ({ ...prev, [bankGuid]: false }));
    }
  };

  return (
    <>
      <ConfirmDialog group="ConfirmDialogTemplating" />
      <div className="settings-container">
        <div className="d-flex justify-content-between align-items-center">
          <div className="back-button" onClick={()=>navigate('/')}>
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.3871 0.209705L4.29289 0.292893L0.292893 4.29289C-0.0675907 4.65338 -0.0953203 5.22061 0.209705 5.6129L0.292893 5.70711L4.29289 9.70711C4.68342 10.0976 5.31658 10.0976 5.70711 9.70711C6.06759 9.34662 6.09532 8.77939 5.7903 8.3871L5.70711 8.29289L3.414 5.999L12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4L3.416 3.999L5.70711 1.70711C6.06759 1.34662 6.09532 0.779392 5.7903 0.387101L5.70711 0.292893C5.34662 -0.0675907 4.77939 -0.0953203 4.3871 0.209705Z" fill="#8200BA"/>
            </svg>
            <span>{ t('settings.returnHome') }</span>
          </div>
        </div>
        <div className="datatable-area-container editable-table-container">
          {!loading ? (
            bankGroups?.length > 0 ? (
              bankGroups.map((bank, bankIndex) => {
                const bankKey = bank.bankGuid;
                const isEditable = bankToggles[bankKey] || false;
                const bankData = (bankEditableData[bankKey] || bank.installments || []).map((item, rowIndex) => ({
                  ...item,
                  _uniqueKey: `${bankIndex}-${rowIndex}`
                }));
                const columns = getColumns(bankKey, isEditable);
                const displayBankName = bankList?.find(b => b.guid === bank.bankGuid)?.bankName;
                
                return (
                  <div key={bankIndex} className='bank-section'>
                    <div className="title-wrapper">
                      <div className="bank-title">{ displayBankName }</div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="input-switch">
                          <InputSwitch
                            id={`isEditable-${bankKey}`}
                            name={`isEditable-${bankKey}`}
                            checked={isEditable}
                            onChange={() => handleToggleChange(bankKey)}
                          />
                          <span>{t("settings.reflectToMerchantLabel")}</span>
                        </div>
                        <Button 
                          type="submit" 
                          className="save-button" 
                          disabled={loading || savingBanks[bankKey]} 
                          onClick={() => confirmDialog(bankKey)}
                        >
                          <i className="pi pi-save"></i>
                          <span>{savingBanks[bankKey] ? t('common.loading') : t('common.save')}</span>
                        </Button>
                      </div>
                    </div>
                    
                    <DataTable 
                      key={bankIndex}
                      value={bankData}
                      editMode={isEditable ? "cell" : undefined}
                      dataKey="_uniqueKey"
                      scrollable
                      style={{ backgroundColor: 'white' }}
                    >
                      {columns.map((col, colIndex) => (
                        <Column 
                          key={colIndex} 
                          field={col.field}
                          header={col.header}
                          sortable={col.sortable}
                          body={col.body}
                          editor={col.editor}
                          style={{ 
                            width: col.width,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        />
                      ))}
                    </DataTable>
                  </div>
                );
              })
            ) : (
              <div>{t('common.recordEmptyMessage')}</div>
            )
          ) : (
            <div className="custom-table-progress-spinner">
              <ProgressSpinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MerchantCommissionList;