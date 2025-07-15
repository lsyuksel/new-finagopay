import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ChargebackMonitoring = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.chargebackmonitoring')}
      </h4>
      <p>
        Chargeback İzleme sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default ChargebackMonitoring; 