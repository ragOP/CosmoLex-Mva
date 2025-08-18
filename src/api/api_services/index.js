import { BACKEND_URL } from '../endpoint/index';
import axios from 'axios';
import { getToken, clearAuthData } from '@/utils/auth';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';

// Create axios instance
const axiosInstance = axios.create();

// Setup interceptor to handle token expiration
export const setupAxiosInterceptor = (store) => {
  // Clear any existing interceptors first
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.response.clear();

  // Add response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Check if the response indicates token expiration
      const data = response.data;

      // Handle different response structures
      if (data) {
        // Check for direct response structure
        if (data.Apistatus === false && data.message === 'Token has expired') {
          console.log('Token expired detected - direct structure');
          handleTokenExpiration(store);
          return Promise.reject(new Error('Token has expired'));
        }
      }

      return response;
    },
    (error) => {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.Apistatus === false && data.message === 'Token has expired') {
          console.log('Token expired detected in error response');
          handleTokenExpiration(store);
        }
      }

      return Promise.reject(error);
    }
  );

  console.log('Axios interceptors registered successfully');
};

// Helper function to handle token expiration
const handleTokenExpiration = (store) => {
  console.log('Handling token expiration...');

  // Show logout toast
  toast.error('Session expired. Please login again.', {
    duration: 4000,
    description: 'Your session has expired due to inactivity.'
  });

  // Clear all auth data
  clearAuthData();

  // Dispatch logout action
  store.dispatch(logout());

  // Redirect to login page
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

export const apiService = async ({
  endpoint,
  method = 'GET',
  data,
  params,
  token: _token,
  headers = {},
  customUrl,
  removeToken = false,
  signal,
}) => {
  try {
    const token = getToken();

    const requestHeaders = {
      'ngrok-skip-browser-warning': 'true',
      ...headers,
    };

    if (!removeToken && (token || _token)) {
      requestHeaders.Authorization = `Bearer ${_token || token}`;
    }

    const requestObj = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      method,
      params,
      data,
      signal,
      headers: requestHeaders,
    };

    const { data: res } = await axiosInstance(requestObj);
    return { response: res };
  } catch (error) {
    console.error(error, 'backend endpoint error');
    return { success: false, error: true, ...(error || {}) };
  }
};
