import axios from 'axios';

import client from '@src/axios-client';
import { useAuthStore } from '@hooks/useAuthStore';
import { refreshAccessToken } from '@services/auth';

client.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refresh;
      if (!refreshToken) {
        return Promise.reject(error);
      }

      const refreshAccessTokenResponse = await refreshAccessToken(refreshToken);
      useAuthStore.getState().setAccess(refreshAccessTokenResponse.access);
      axios.defaults.headers.common.authorization = `Bearer ${refreshAccessTokenResponse.access}`;

      return client(originalRequest);
    }
    return Promise.reject(error);
  },
);
