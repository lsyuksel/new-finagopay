import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const DateRangeDialog = ({
  visible,
  onHide,
  onApply,
  initialRange = null,
  title = "Tarih Aralığı Seç"
}) => {
  const [range, setRange] = useState(initialRange);

  const handleApply = () => {
    onApply(range);
    onHide();
  };

  const handleClear = () => {
    setRange(null);
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: '30vw', minWidth: 350 }}
      onHide={onHide}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button label="Temizle" onClick={handleClear} className="p-button-outlined" />
          <Button label="Uygula" onClick={handleApply} className="p-button-primary" disabled={!range || !range[0] || !range[1]} />
        </div>
      }
      modal
    >
      <Calendar
        value={range}
        onChange={(e) => setRange(e.value)}
        selectionMode="range"
        inline
        showWeek
        dateFormat="dd.mm.yy"
        placeholder="Tarih Aralığı Seçin"
        style={{ width: '100%' }}
      />
    </Dialog>
  );
};

export default DateRangeDialog;