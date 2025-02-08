import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TransactionMonitoring = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.transactionmonitoring')}
      </h4>
      <p>
        İşlem İzleme sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default TransactionMonitoring; 