import api from './axios';

export const staffAPI = {
  // Customer Management
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.patch(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  
  // Address Management
  getCustomerAddresses: (customerId) => api.get(`/customers/${customerId}/addresses`),
  addAddress: (customerId, data) => api.post(`/customers/${customerId}/addresses`, data),
  updateAddress: (customerId, addressId, data) => api.patch(`/customers/${customerId}/addresses/${addressId}`, data),
  deleteAddress: (customerId, addressId) => api.delete(`/customers/${customerId}/addresses/${addressId}`),
  
  // Order Management
  placeOrder: (data) => api.post('/orders', data),
  placeOrderOnBehalf: (customerId, data) => api.post(`/orders/on-behalf/${customerId}`, data),
  getOrders: (params) => api.get('/orders/staff-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (orderId, status) => api.patch(`/orders/${orderId}/status`, { status }),
  
  // Invoice Management
  getInvoices: (params) => api.get('/orders/staff-orders', { params }),
  updateInvoice: (orderId, data) => api.patch(`/orders/${orderId}/invoice`, data),
  generateInvoicePDF: (orderId) => api.get(`/orders/${orderId}/pdf`, { responseType: 'blob' }),
  
  // Staff Profile (for future use)
  getStaffProfile: () => api.get('/users/me'),
  updateStaffProfile: (data) => api.patch('/users/me', data),
};
