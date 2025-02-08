import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MerchantCommissionList = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.merchantcommissionlist')}
      </Typography>
      <Typography variant="body1">
        Üye İşyeri Komisyon Listesi sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default MerchantCommissionList; 