import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MerchantApplication = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.merchantapplication')}
      </Typography>
      <Typography variant="body1">
        Üye İşyeri Başvurusu sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default MerchantApplication; 