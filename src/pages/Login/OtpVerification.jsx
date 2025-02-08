import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Container, Box, Button } from '@mui/material';
import { toast } from 'react-toastify';
import AuthCode from 'react-auth-code-input';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../../services/api';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';

const OtpVerification = ({ loginData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleOnChange = (res) => {
    setOtp(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error(t('errors.invalidOtp'));
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const verificationData = {
        ...loginData,
        verificationCode: otp,
      };

      console.log('OTP verification attempt with:', verificationData);
      
      const response = await authService.verifyOtp(verificationData);
      console.log('OTP verification response:', response);
      
      if (response && (response.data || response.accessToken)) {
        const responseData = response.data || response;
        console.log('Processing response data:', responseData);

        // Redux store'a kullanıcı bilgilerini kaydet
        dispatch(setCredentials({
          user: responseData.user || responseData,
          token: responseData.accessToken,
        }));
        
        toast.success(t('messages.success'));
        navigate('/dashboard');
      } else {
        console.error('Invalid OTP verification response structure:', response);
        dispatch(setError(t('errors.invalidResponse')));
        toast.error(t('errors.invalidResponse'));
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          t('messages.error');
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
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
            {t('common.otpVerification')}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('common.otpInstructions')}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <AuthCode
                onChange={handleOnChange}
                length={6}
                inputClassName="otp-input"
                containerClassName="otp-container"
                disabled={loading}
              />
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={otp.length !== 6 || loading}
            >
              {loading ? t('common.verifying') : t('common.verify')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OtpVerification; 