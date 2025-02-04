import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Container, Box, Button } from '@mui/material';
import { toast } from 'react-toastify';
import AuthCode from 'react-auth-code-input';
import { authService } from '../../services/api';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOnChange = (res) => {
    setOtp(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Lütfen 6 haneli doğrulama kodunu giriniz');
      return;
    }

    try {
      const verificationData = {
        userName: localStorage.getItem('userName'),
        password: localStorage.getItem('enteredPassword'),
        verificationCode: otp,
        qrString: localStorage.getItem('qrString'),
        phone: localStorage.getItem('phone'),
        otpDatetime: localStorage.getItem('otpDatetime')
      };

      console.log('OTP verification attempt with:', verificationData);
      
      const response = await authService.verifyOtp(verificationData);
      console.log('OTP verification response:', response);
      
      // API yanıtını detaylı kontrol edelim
      if (response && (response.data || response.accessToken)) {
        const responseData = response.data || response;
        console.log('Processing response data:', responseData);

        // Tüm response verisini localStorage'a kaydedelim
        if (typeof responseData === 'object') {
          Object.entries(responseData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              localStorage.setItem(key, value.toString());
            }
          });
        }
        
        // Token bilgilerini özel olarak kaydedelim
        if (responseData.accessToken) {
          localStorage.setItem('token', responseData.accessToken);
        }
        if (responseData.refreshToken) {
          localStorage.setItem('refreshToken', responseData.refreshToken);
        }
        
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Giriş başarılı');
        
        // Önce yönlendirmeyi yapalım, sonra sayfayı yenileyelim
        navigate('/dashboard');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error('Invalid OTP verification response structure:', response);
        toast.error('Doğrulama başarısız - API yanıtı geçersiz format');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Doğrulama başarısız';
      toast.error(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            SMS Doğrulama
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Telefonunuza gönderilen 6 haneli doğrulama kodunu giriniz
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <AuthCode
                onChange={handleOnChange}
                length={6}
                inputClassName="otp-input"
                containerClassName="otp-container"
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={otp.length !== 6}
            >
              Doğrula
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OtpVerification; 