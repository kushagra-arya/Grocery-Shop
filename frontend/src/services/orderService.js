import api from './api';

const orderService = {
  // Get user's orders
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get single order details
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order - initiates the checkout process
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Initiate payment - creates a payment session
  initiatePayment: async (orderId, paymentMethod) => {
    const response = await api.post(`/orders/${orderId}/initiate-payment`, { paymentMethod });
    return response.data;
  },

  // Verify payment - called after payment gateway redirect
  verifyPayment: async (orderId, paymentData) => {
    const response = await api.post(`/orders/${orderId}/verify-payment`, paymentData);
    return response.data;
  },

  // Get order by order number (for confirmation page)
  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin functions
  getAllOrders: async (params = {}) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// Named exports for convenience
export const {
  getOrders,
  getOrder,
  createOrder,
  initiatePayment,
  verifyPayment,
  getOrderByNumber,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = orderService;

export default orderService;
