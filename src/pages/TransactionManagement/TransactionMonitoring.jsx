import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TransactionMonitoring = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.transactionmonitoring')}
      </Typography>
      <Typography variant="body1">
        İşlem İzleme sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default TransactionMonitoring; 