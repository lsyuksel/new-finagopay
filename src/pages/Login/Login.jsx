import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { authService } from '../../services/api';
import OtpVerification from './OtpVerification';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Kullanıcı adı gereklidir'),
  password: Yup.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [loginData, setLoginData] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Login attempt with:', values);
        const response = await authService.login(values);
        console.log('Login response:', response);
        
        if (response && response.otpDatetime) {
          setLoginData(response);
          setShowOtp(true);
          toast.success('Doğrulama kodu gönderildi');
        } else {
          console.error('Invalid login response:', response);
          toast.error('Giriş başarısız - Geçersiz yanıt');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.message || 'Giriş başarısız');
      }
    },
  });

  if (showOtp) {
    return <OtpVerification loginData={loginData} />;
  }

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
          <Typography component="h1" variant="h5">
            Giriş Yap
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Kullanıcı Adı"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Şifre"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 