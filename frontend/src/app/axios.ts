import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
export default axiosInstance;
