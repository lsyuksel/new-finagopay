import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Card, Form, Button } from 'react-bootstrap';
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
    <div className="auth-container">
      <Container>
        <Card className="auth-card mx-auto">
          <Card.Body>
            <h4 className="text-center mb-4">{t('common.login')}</h4>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>{t('common.email')}</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.email && formik.errors.email}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.email && formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>{t('common.password')}</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.password && formik.errors.password}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.password && formik.errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              {error && (
                <div className="text-danger mb-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('common.loading')}
                  </>
                ) : (
                  t('common.login')
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login; 