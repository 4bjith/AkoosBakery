import api from './axios';

export const orderAPI = {
  // Public/Customer routes
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOne: (id) => api.get(`/orders/${id}`),

  // Admin routes
  getAll: () => api.get('/orders'),
  updateStatus: (id, payload) => api.patch(`/orders/${id}/status`, payload),
};
