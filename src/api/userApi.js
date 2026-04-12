import api from './axios';

export const userAPI = {
  // ─── Auth ─────────────────────────────────────────────
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),

  // ─── Profile ──────────────────────────────────────────
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/me', data),
  updatePassword: (data) => api.patch('/users/update-password', data),
  deleteMe: () => api.delete('/users/me'),

  // ─── Addresses ────────────────────────────────────────
  addAddress: (data) => api.post('/users/me/addresses', data),
  deleteAddress: (id) => api.delete(`/users/me/addresses/${id}`),

  // ─── Admin Management ─────────────────────────────────
  getAllUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
