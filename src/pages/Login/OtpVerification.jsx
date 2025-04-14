import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthCode from "react-auth-code-input";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { authService } from "../../services/api";
import {
  setCredentials,
  setLoading,
  setError,
} from "../../store/slices/authSlice";
import { Message } from "primereact/message";

const OtpVerification = ({ loginData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (res) => {
    setOtp(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      dispatch(setError(t("errors.invalidOtp")));
      toast.error(t("errors.invalidOtp"));
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

        dispatch(
          setCredentials({
            user: responseData.user || responseData,
            token: responseData.accessToken,
          })
        );

        toast.success(t("messages.success"));
        navigate("/dashboard");
      } else {
        dispatch(setError(t("errors.invalidResponse")));
        toast.error(t("errors.invalidResponse"));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        t("messages.error");
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Message
          severity="error"
          className="d-flex justify-content-start gap-1 mb-4"
          content={
            <>
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.0729 16.9113C19.0112 13.2432 16.9489 9.57369 14.8866 5.90495C14.3613 4.96984 13.837 4.03931 13.3136 3.10442C13.0298 2.55231 12.676 1.97536 12.086 1.70968C11.6874 1.52365 11.2966 1.42152 10.8541 1.45005C10.1 1.49329 9.39537 1.91666 8.99294 2.55444C8.85798 2.79307 8.7276 3.03336 8.58815 3.27162C8.0274 4.27382 7.46061 5.27693 6.89858 6.27896C4.88312 9.93456 2.75084 13.5295 0.793731 17.2149C0.817928 17.1181 0.861916 17.0279 0.908133 16.9421C-0.0544954 18.4772 1.06235 20.5686 2.89252 20.5566C3.15867 20.5588 3.42709 20.5566 3.69327 20.5566H19.1061C20.9576 20.5401 22.0512 18.4739 21.0729 16.9113ZM11.8375 17.1225C11.1062 17.8588 9.81192 17.3238 9.81794 16.2865C9.79924 15.6519 10.372 15.0926 11.0015 15.1029C12.0405 15.0934 12.5786 16.4004 11.8375 17.1225ZM12.1829 12.6588C12.1899 13.6985 10.8874 14.2339 10.1633 13.4947C9.95211 13.2792 9.81792 12.9602 9.81792 12.6588V9.36109C9.87715 7.79755 12.1265 7.79886 12.1829 9.36111C12.1829 9.36109 12.1829 12.6588 12.1829 12.6588Z"
                  fill="#F04438"
                />
                <path
                  d="M0.789062 17.2142C0.813259 17.1174 0.857247 17.0272 0.903464 16.9414C0.868257 17.0316 0.828673 17.1218 0.789062 17.2142Z"
                  fill="#F04438"
                />
              </svg>
              <div>
                <b>Hata: </b>
                {error}
              </div>
            </>
          }
        />
      )}
      <div className="form-subtitle">{t("common.otpVerification")}</div>
      <div className="form-title">{t("common.otpInstructions")}</div>

      <AuthCode
        onChange={handleOnChange}
        length={6}
        inputClassName="form-control otp-input"
        containerClassName="otp-input-container"
        disabled={loading}
      />
      <Button type="submit" className="login-button" disabled={loading}>
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {t("common.verifying")}
          </>
        ) : (
          t("common.verify")
        )}
      </Button>
    </Form>
  );
};

export default OtpVerification;