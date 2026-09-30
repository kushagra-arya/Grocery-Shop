import api from './api';

const adminService = {
  // Dashboard Statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Order Management
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Inventory Management
  getInventoryLogs: async (params = {}) => {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },

  updateInventory: async (productId, data) => {
    const response = await api.post(`/admin/inventory/${productId}`, data);
    return response.data;
  },
};

export default adminService;
