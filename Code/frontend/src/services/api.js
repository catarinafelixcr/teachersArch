// src/services/api.js
import axios from 'axios';
import { getAccessToken, refreshAccessToken, setAccessToken } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8000', // teu backend
});

// Adiciona token de acesso automaticamente
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Se der 401, tenta renovar o token automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // só tenta 1 vez
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const success = await refreshAccessToken();
      if (success) {
        originalRequest.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
