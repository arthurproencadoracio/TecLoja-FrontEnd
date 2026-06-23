import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const api = axios.create({
  baseURL: 'https://tecloja-api.render.com/api'
});

// Interceptador de Requisições: Anexa o Bearer JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const { currentUser } = useAuth();
    if (currentUser.value?.token) {
      config.headers.Authorization = `Bearer ${currentUser.value.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
