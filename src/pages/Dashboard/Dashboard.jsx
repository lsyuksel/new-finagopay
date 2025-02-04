import { Box, Typography, Grid, Paper } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  const summaryCards = [
    {
      title: 'Toplam Bakiye',
      value: '₺125.000,00',
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#AB63BF' }} />,
      change: '+₺15.000 bu ay'
    },
    {
      title: 'Toplam İşlem',
      value: '1.250',
      icon: <PaymentsIcon sx={{ fontSize: 40, color: '#AB63BF' }} />,
      change: '+150 bu ay'
    },
    {
      title: 'Bekleyen İşlemler',
      value: '25',
      icon: <ReceiptLongIcon sx={{ fontSize: 40, color: '#AB63BF' }} />,
      change: '-5 geçen haftaya göre'
    },
    {
      title: 'Başarı Oranı',
      value: '%98.5',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#AB63BF' }} />,
      change: '+0.5% geçen aya göre'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hoş Geldiniz
      </Typography>
      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {card.icon}
                <Typography variant="h4" component="div">
                  {card.value}
                </Typography>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.change}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 