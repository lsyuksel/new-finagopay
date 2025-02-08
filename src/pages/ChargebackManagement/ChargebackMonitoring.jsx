import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ChargebackMonitoring = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.chargebackmonitoring')}
      </Typography>
      <Typography variant="body1">
        Chargeback İzleme sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default ChargebackMonitoring; 