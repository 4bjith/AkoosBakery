import api from './axios';

export const productAPI = {
  // Public (or general user) routes
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),

  // Admin routes
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};
