import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UserDefinition = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.userdefinition')}
      </Typography>
      <Typography variant="body1">
        Kullanıcı Tanımlama sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default UserDefinition; 