import api from './api';

const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data; // Return the entire response with data and pagination
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data.data; // Extract the array from the API response wrapper
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return Array.isArray(response.data) ? response.data : (response.data.data || []);
  },

  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Admin functions
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
