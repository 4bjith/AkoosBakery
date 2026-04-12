import api from './axios';

export const categoryAPI = {
  // Public/Admin routes
  getAll: (params) => api.get('/categories', { params }),
  
  // Admin only routes
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};
