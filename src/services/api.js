import axios from 'axios';
import { AUTH_URL } from '../constants/apiUrls';
import JSONbig from 'json-bigint';

const JSONbigInt = JSONbig({ storeAsString: true });

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [data => data] // Ham veriyi dönüştürmeden al
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    try {
      // response.data string olarak gelecek, JSONbigInt ile parse et
      return response.data ? JSONbigInt.parse(response.data) : response.data;
    } catch (error) {
      console.warn('JSON parse error:', error);
      return response.data;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('enteredPassword');
      localStorage.removeItem('otpDatetime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(AUTH_URL.Login, {
        userName: credentials.email,
        password: credentials.password,
      });
      
      // Tüm response verilerini localStorage'a kaydet
      if (response) {
        Object.entries(response).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value.toString());
          }
        });
        localStorage.setItem('enteredPassword', credentials.password);

        // Login başarılı olduktan sonra SMS gönder
        await authService.sendVerificationCode();
      }
      return response;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },
  
  verifyOtp: async (data) => {
    const response = await api.post(AUTH_URL.VerifyTwoFactorSecret, {
      userName: data.userName,
      password: data.password,
      verificationCode: data.verificationCode,
      qrString: data.qrString,
      phone: data.phone,
      otpDatetime: data.otpDatetime
    });
    return response;
  },

  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },

  sendVerificationCode: async () => {
    try {
      const response = await api.post(AUTH_URL.SendVerificationCode, {
        userName: localStorage.getItem('userName'),
        password: localStorage.getItem('enteredPassword'),
        otpDatetime: localStorage.getItem('otpDatetime'),
        qrString: localStorage.getItem('qrString'),
        phone: localStorage.getItem('phone')
      });
      
      if (response) {
        Object.entries(response).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value.toString());
          }
        });
      }
      return response;
    } catch (error) {
      console.error('Send Verification Code Error:', error);
      throw error;
    }
  },
};

export default api; 