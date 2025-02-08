import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MerchantApplication = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.merchantapplication')}
      </h4>
      <p>
        Üye İşyeri Başvurusu sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default MerchantApplication; 