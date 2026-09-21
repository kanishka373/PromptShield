import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('promptshield_user') || '{}');
  if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});
// 
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('promptshield_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
// 

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile=(data)=>API.patch('/auth/profile',data);
export const changePassword=(data)=>API.patch('/auth/password',data);
export const exportUserData=()=>API.get('/auth/export');
export const  deleteAccount=()=>API.delete('/auth/account');
// Scans
export const scanText = (text) => API.post('/scans/scan', { text });
export const saveScan = (data) => API.post('/scans/save', data);
export const getHistory = () => API.get('/scans/history');
export const deleteScan = (id) => API.delete(`/scans/${id}`);
export const getSummary = () => API.get('/scans/summary');
export const getPublicActivity = () => API.get('/scans/public-activity');
export const getSafeDays = () =>API.get('/scans/safe-days');
