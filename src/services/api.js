import axios from 'axios';
import { AUTH_URL } from '../constants/apiUrls';
import JSONbig from 'json-bigint';

const JSONbigInt = JSONbig({ storeAsString: true });

// managementApi için ayrı axios instance (bazı durumlarda)
export const managementApi = axios.create({
  baseURL: import.meta.env.VITE_API_MANAGEMENT_URL,
  timeout: 60000, // 60 saniye timeout (uzun süren işlemler için)
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [data => data] // Ham veriyi dönüştürmeden al
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [data => data] // Ham veriyi dönüştürmeden al
});

// Auth için ayrı axios instance
export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [data => data] // Ham veriyi dönüştürmeden al
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Eski projede token direkt gönderiliyor, Bearer eklenmiyor
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('Act');
    if (token) {
      config.headers.Authorization = token;
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('Act');
      localStorage.removeItem('userName');
      localStorage.removeItem('enteredPassword');
      localStorage.removeItem('otpDatetime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API için interceptor'lar
authApi.interceptors.request.use(
  (config) => {
    // Eski projede token direkt gönderiliyor, Bearer eklenmiyor
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('Act');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authApi.interceptors.response.use(
  (response) => {
    try {
      return response.data ? JSONbigInt.parse(response.data) : response.data;
    } catch (error) {
      console.warn('JSON parse error:', error);
      return response.data;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('Act');
      localStorage.removeItem('userName');
      localStorage.removeItem('enteredPassword');
      localStorage.removeItem('otpDatetime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


managementApi.interceptors.response.use(
  (response) => {
    try {
      return response.data ? JSONbigInt.parse(response.data) : response.data;
    } catch (error) {
      console.warn('JSON parse error:', error);
      return response.data;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('Act');
      localStorage.removeItem('userName');
      localStorage.removeItem('enteredPassword');
      localStorage.removeItem('otpDatetime');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const parseErrorResponse = (errorString) => {
  try {
    const errorObj = JSON.parse(errorString);
    return {
      code: errorObj.Code,
      message: errorObj.Message?.replace("{0}", ""),
      details: errorObj.Details?.replace("{0}", ""),
      correlationId: errorObj.CorrelationId,
      errorCode: errorObj.validationResults?.[0]?.ErrorMessage
    };
  } catch (e) {
    return {
      code: "ERROR",
      message: errorString || t("messages.registerError"),
      details: errorString
    };
  }
};

export const authService = {
  login: async (credentials) => {
    try {
      const response = await authApi.post(AUTH_URL.Login, {
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
    const response = await authApi.post(AUTH_URL.VerifyTwoFactorSecret, {
      userName: data.userName,
      password: data.password,
      verificationCode: data.verificationCode,
      qrString: data.qrString,
      phone: data.phone,
      otpDatetime: data.otpDatetime
    });

    return response;
  },

  logout: async () => {
    try {
      // Logout API çağrısı yap - PUT metodu ve userGuid query parameter
      const userGuid = localStorage.getItem('guid') || localStorage.getItem('userGuid');
      if (userGuid) {
        // Query parameter olarak userGuid gönder
        await authApi.put(`${AUTH_URL.Logout}?userGuid=${userGuid}`);
      }
      return { success: true };
    } catch (error) {
      // Logout API hatası olsa bile devam et (localStorage temizlenecek)
      console.warn('Logout API Error:', error);
      return { success: false, error: error.message };
    }
  },

  sendVerificationCode: async () => {
    try {
      const response = await authApi.post(AUTH_URL.SendVerificationCode, {
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