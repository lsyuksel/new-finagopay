import React from 'react';
import { useTranslation } from 'react-i18next';

const DateFilter = ({ selectedFilter, onFilterChange }) => {
  const { t } = useTranslation();

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
    </div>
  );
};

export default DateFilter; 