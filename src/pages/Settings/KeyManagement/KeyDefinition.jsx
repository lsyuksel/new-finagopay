import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const KeyDefinition = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.keydefinition')}
      </h4>
      <p>
        Anahtar Tanımlama sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default KeyDefinition; 