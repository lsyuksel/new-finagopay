import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrencyNumericName, priceFormat } from '../../../utils/helpers';

export default function TransactionBox({item, icon, className, currencyName}) {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className='top'>
        <div>
          <span className='title'>{t(`dashboards.transactionBoxTitle_${item.transactionTypeCode}`)}</span>
          <div className='price'><b>{priceFormat(item.currencies[0]?.transactionTotalAmount) || 0}</b> {getCurrencyNumericName(currencyName)}</div>
        </div>
        <i><img src={icon} alt="" /></i>
      </div>
      <div className='bottom'>Toplam <b>{item.totalTransactionCount}</b> işlem gerçekleşti</div>
    </div>
  );
};
