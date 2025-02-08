import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const KeyDefinition = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('menu.keydefinition')}
      </Typography>
      <Typography variant="body1">
        Anahtar Tanımlama sayfası içeriği burada yer alacak.
      </Typography>
    </Box>
  );
};

export default KeyDefinition; 