import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import { setCredentials, setLoading, setError } from '../../store/slices/authSlice';
import OtpVerification from './OtpVerification';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [showOtp, setShowOtp] = useState(false);
  const [loginData, setLoginData] = useState(null);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required(t('errors.required')),
    password: Yup.string()
      .min(6, t('errors.invalidPassword'))
      .required(t('errors.required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        const response = await authService.login(values);
        
        if (response && response.otpDatetime) {
          setLoginData(response);
          setShowOtp(true);
          toast.success(t('messages.success'));
        } else {
          console.error('Invalid login response:', response);
          dispatch(setError(t('messages.error')));
          toast.error(t('messages.error'));
        }
      } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error.response?.data?.message || t('messages.error');
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
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
            {t('common.login')}
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label={t('common.email')}
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={loading}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label={t('common.password')}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              disabled={loading}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Giriş yapılıyor...' : t('common.login')}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 