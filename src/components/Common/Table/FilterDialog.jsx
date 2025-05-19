import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const FilterDialog = ({ visible, onHide, onFilter }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [filters, setFilters] = useState({
    cardFirst6: '',
    cardLast4: '',
    cardHolder: '',
    amount: '',
    amountOperator: 'eq', // eq, lt, gt
    paymentId: '',
    bankUniqueReferenceNumber: '',
    transactionNetworkGuid: null,
    ravenTransactionTypeGuid: null,
    cardTypeGuid: null,
    provisionStatusGuid: null,
    installmentTypeGuid: null,
    posEntryModeGuid: null,
    bankGuid: null,
    startDate: null,
    endDate: null
  });

  // Redux store'dan select option'ları al
  const {
    allTransactionNetwork,
    allAuthorizationResponseCode,
    allTransactionType,
    allCardTypeName,
    allProvisionStatus,
    allInstallmentType,
    allPosEntryMode,
    allBankName
  } = useSelector((state) => state.selectOptions);

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilter = () => {
    onFilter(filters);
    onHide();
  };

  const handleClear = () => {
    setFilters({
      cardFirst6: '',
      cardLast4: '',
      cardHolder: '',
      amount: '',
      amountOperator: 'eq', // eq, lt, gt
      paymentId: '',
      bankUniqueReferenceNumber: '',
      transactionNetworkGuid: null,
      ravenTransactionTypeGuid: null,
      cardTypeGuid: null,
      provisionStatusGuid: null,
      installmentTypeGuid: null,
      posEntryModeGuid: null,
      bankGuid: null,
      startDate: null,
      endDate: null
    });
  };

  const renderFooter = () => {
    return (
      <div>
        <Button label={t('common.clear')} icon="pi pi-times" onClick={handleClear} className="p-button-text" />
        <Button label={t('common.filter')} icon="pi pi-check" onClick={handleFilter} autoFocus />
      </div>
    );
  };

  return (
    <Dialog 
      visible={visible} 
      style={{ width: '90%' }} 
      footer={renderFooter()} 
      onHide={onHide}
    >
      <div className="title-area">
        <div className="title">{t('common.filterDialogTitle')} </div>
        <div className="subtitle">{t('common.filterDialogSubTitle')} </div>
      </div>
      <div className="grid">
        <div className="col-12 md:col-6">
          <InputText
            type="text"
            maxLength={6}
            value={filters.cardFirst6}
            onChange={e => setFilters({ ...filters, cardFirst6: e.target.value.replace(/[^0-9]/g, '') })}
            className="p-form-control"
            placeholder={t('common.cardFirst6')}
          />
        </div>
        <div className="col-12 md:col-6">
          <InputText
            type="text"
            maxLength={4}
            value={filters.cardLast4}
            onChange={e => setFilters({ ...filters, cardLast4: e.target.value.replace(/[^0-9]/g, '') })}
            className="p-form-control"
            placeholder={t('common.cardLast4')}
          />
        </div>
        <div className="col-12 md:col-6">
          <InputText
            type="text"
            value={filters.cardHolder}
            onChange={e => setFilters({ ...filters, cardHolder: e.target.value })}
            className="p-form-control"
            placeholder={t('common.cardHolder')}
          />
        </div>
        <div className="col-12 md:col-6">
          <div style={{ display: 'flex', gap: 8 }}>
            <InputText
              type="number"
              value={filters.amount}
              onChange={e => setFilters({ ...filters, amount: e.target.value })}
              className="p-form-control"
              placeholder={t('common.amount')}
              min={0}
            />
            <Dropdown
              value={filters.amountOperator}
              options={[
                { label: t('common.equals'), value: 'eq' },
                { label: t('common.greaterThan'), value: 'gt' },
                { label: t('common.lessThan'), value: 'lt' }
              ]}
              onChange={e => setFilters({ ...filters, amountOperator: e.value })}
              className="p-form-control"
              style={{ width: 120 }}
              placeholder={t('common.select')}
            />
          </div>
        </div>
        <div className="col-12 md:col-6">
          <div className="field">
            <InputText
              id="paymentId"
              value={filters.paymentId}
              onChange={(e) => handleInputChange('paymentId', e.target.value)}
              className="p-form-control"
              placeholder={t('transaction.paymentId')}
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <Dropdown
              id="transactionNetwork"
              value={filters.transactionNetworkGuid}
              options={allTransactionNetwork}
              onChange={(e) => handleInputChange('transactionNetworkGuid', e.value)}
              optionLabel="description"
              optionValue="guid"
              placeholder={t('transaction.transactionNetwork')}
              filter
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <Dropdown
              id="transactionType"
              value={filters.ravenTransactionTypeGuid}
              options={allTransactionType}
              onChange={(e) => handleInputChange('ravenTransactionTypeGuid', e.value)}
              optionLabel="description"
              optionValue="guid"
              placeholder={t('transaction.transactionType')}
              filter
            />
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="field">
            <Dropdown
              id="cardType"
              value={filters.cardTypeGuid}
              options={allCardTypeName}
              onChange={(e) => handleInputChange('cardTypeGuid', e.value)}
              optionLabel="description"
              optionValue="guid"
              placeholder={t('transaction.cardType')}
              filter
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterDialog; 