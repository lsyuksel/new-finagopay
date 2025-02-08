import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
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
      
      const response = await authService.verifyOtp(verificationData);
      
      if (response && (response.data || response.accessToken)) {
        const responseData = response.data || response;

        dispatch(setCredentials({
          user: responseData.user || responseData,
          token: responseData.accessToken,
        }));
        
        toast.success(t('messages.success'));
        navigate('/dashboard');
      } else {
        dispatch(setError(t('errors.invalidResponse')));
        toast.error(t('errors.invalidResponse'));
      }
    } catch (error) {
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
    <div className="auth-container">
      <Container>
        <Card className="auth-card mx-auto">
          <Card.Body>
            <h4 className="text-center mb-3">
              {t('common.otpVerification')}
            </h4>
            <p className="text-center text-muted mb-4">
              {t('common.otpInstructions')}
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="d-flex justify-content-center mb-4">
                <AuthCode
                  onChange={handleOnChange}
                  length={6}
                  inputClassName="form-control otp-input"
                  containerClassName="d-flex gap-2"
                  disabled={loading}
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={otp.length !== 6 || loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('common.verifying')}
                  </>
                ) : (
                  t('common.verify')
                )}
              </Button>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default OtpVerification; 