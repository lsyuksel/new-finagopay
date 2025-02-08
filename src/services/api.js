import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
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
      return typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    } catch {
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
      const response = await api.post('/Authentication/Login', {
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
    const response = await api.post('/Authentication/VerifyTwoFactorSecret', {
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
      const response = await api.post('/Authentication/SendVerificationCode', {
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