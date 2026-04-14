import api from './axios';

export const adminAPI = {
  // Staff Management
  getAllStaff: (params) => api.get('/staff', { params }),
  getStaff: (id) => api.get(`/staff/${id}`),
  createStaff: (data) => api.post('/staff', data),
  updateStaff: (id, data) => api.patch(`/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/staff/${id}`),
  updateStaffPermissions: (id, permissions) => api.patch(`/staff/${id}/permissions`, { permissions }),
  
  // Staff Assignments
  getStaffAssignments: (params) => api.get('/staff/assignments/all', { params }),
  assignCustomersToStaff: (staffId, data) => api.post(`/staff/${staffId}/assignments`, data),
  removeCustomerAssignment: (staffId, customerId) => api.delete(`/staff/${staffId}/assignments/${customerId}`),
  
  // Customer Management (Admin view)
  getAllCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.patch(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  
  // User Management (existing)
  getAllUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
