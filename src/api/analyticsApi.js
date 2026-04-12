import api from './axios';

export const analyticsAPI = {
  // Fetch high-level admin dashboard aggregated metrics
  getDashboardStats: () => api.get('/analytics'),
  getRevenueChart: (period) => api.get(`/analytics/revenue?period=${period}`),
  getSalesStats: () => api.get('/analytics/sales-stats'),
  getUserSalesReport: (userId, params) => api.get(`/analytics/user-report/${userId}`, { params }),
};
