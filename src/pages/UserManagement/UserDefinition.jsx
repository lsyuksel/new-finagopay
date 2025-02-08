import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const UserDefinition = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.userdefinition')}
      </h4>
      <p>
        Kullanıcı Tanımlama sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default UserDefinition; 