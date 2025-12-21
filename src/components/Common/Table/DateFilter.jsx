import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { getCurrencyDef } from '../../../store/slices/selectOptionSlice';

const DateFilter = ({ 
  selectedFilter, 
  onFilterChange, 
  showCurrencyFilter = false,
  onCurrencyChange = null
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currencyDef } = useSelector((state) => state.selectOptions);
  const [currencyValue, setCurrencyValue] = useState('949');

  useEffect(() => {
    if (showCurrencyFilter && currencyDef.length === 0) {
      dispatch(getCurrencyDef());
    }
  }, [showCurrencyFilter, currencyDef.length, dispatch]);

  const handleCurrencyChange = (value) => {
    setCurrencyValue(value);
    if (onCurrencyChange) {
      onCurrencyChange(value);
    }
  };

  const filterOptions = [
    { id: 'all', label: t('common.allTime') },
    { id: 'today', label: t('common.today') },
    { id: 'yesterday', label: t('common.yesterday') },
    { id: '7days', label: t('common.last7Days') },
    { id: '1month', label: t('common.lastMonth') },
    { id: '3months', label: t('common.last3Months') },
    { id: '6months', label: t('common.last6Months') }
  ];

  return (
    <div className='date-filter-buttons'>
      {filterOptions.map((option) => (
        <div
          key={option.id}
          className={selectedFilter === option.id ? 'active' : ''}
          onClick={() => onFilterChange(option.id)}
        >
          {option.label}
        </div>
      ))}
      {showCurrencyFilter && currencyDef?.length > 0 && (
        <Dropdown
          id="currencyGuid"
          name="currencyGuid"
          value={currencyValue}
          onChange={(e) => handleCurrencyChange(e.value)}
          options={currencyDef}
          optionLabel="alphabeticCode"
          optionValue="numericCode"
          className="p-form-control"
          placeholder=""
          filter
        />
      )}
    </div>
  );
};

export default DateFilter; 