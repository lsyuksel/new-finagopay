import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const ReportsFilterDialog = ({ visible, onHide, onFilter }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const [filters, setFilters] = useState({
    payOutStatusGuid: null,
  });

  // Redux store'dan select option'ları al
  const {
    allPayOutStatusDef,
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
      payOutStatusGuid: null,
    });
  };

  const renderFooter = () => {
    return (
      <div className='d-flex gap-4 justify-content-end'>
        <Button label={t('common.clear')} onClick={handleClear} className="clear-button mx-0" />
        <Button label={t('common.filter')} onClick={handleFilter} className="filter-button mx-0" autoFocus />
      </div>
    );
  };

  return (
    <Dialog 
      className='filter-modal-dialog'
      visible={visible} 
      style={{ width: '75%' }} 
      footer={renderFooter()} 
      onHide={onHide}
    >
      <div className="title-area">
        <div className="title">{t('common.filterDialogTitle')} </div>
        <div className="subtitle">{t('common.filterDialogSubTitle')} </div>
      </div>
      <div className="filter-input-content">
        <div className="field w-100">
            <Dropdown
              id="cardType"
              value={filters.payOutStatusGuid}
              options={allPayOutStatusDef}
              onChange={(e) => handleInputChange('payOutStatusGuid', e.value)}
              optionLabel="description"
              optionValue="guid"
              placeholder={t('Ödeme Durumu')}
              filter
            />
          </div>
      </div>
    </Dialog>
  );
};

export default ReportsFilterDialog; 