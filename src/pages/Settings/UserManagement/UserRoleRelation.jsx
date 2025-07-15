import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const UserRoleRelation = () => {
  const { t } = useTranslation();

  return (
    <Container className="py-3">
      <h4 className="mb-4">
        {t('menu.userrolerelation')}
      </h4>
      <p>
        Kullanıcı Rol İlişkisi sayfası içeriği burada yer alacak.
      </p>
    </Container>
  );
};

export default UserRoleRelation; 