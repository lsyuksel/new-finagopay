import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserRoleRelation = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.userrolerelation')}
      </Typography>
      <Typography variant="body1">
        Kullanıcı Rol İlişkisi sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default UserRoleRelation; 