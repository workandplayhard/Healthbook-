import axios from 'axios';
import Config from 'react-native-config';

import { useAuthStore } from '@hooks/useAuthStore';

const client = axios.create({ baseURL: Config.API_URL });

client.interceptors.request.use(
  config => {
    config.headers = {
      authorization: `Bearer ${useAuthStore.getState().access}`,
      ...config.headers,
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default client;
