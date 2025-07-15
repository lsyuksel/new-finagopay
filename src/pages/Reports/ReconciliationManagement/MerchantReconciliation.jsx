import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MerchantReconciliation = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.merchantreconciliation')}
      </h4>
      <p>
        Üye İşyeri Mutabakatı sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default MerchantReconciliation; 