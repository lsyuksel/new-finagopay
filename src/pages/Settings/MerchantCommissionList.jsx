import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MerchantCommissionList = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.merchantcommissionlist')}
      </h4>
      <p>
        1.Üye İşyeri Komisyon Listesi sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default MerchantCommissionList; 