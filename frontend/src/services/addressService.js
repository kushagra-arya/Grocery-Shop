import api from './api';

const addressService = {
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  getAddress: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefaultAddress: async (id) => {
    const response = await api.put(`/addresses/${id}/default`);
    return response.data;
  },
};

// Named exports for compatibility
export const getAddresses = addressService.getAddresses;
export const getAddress = addressService.getAddress;
export const createAddress = addressService.createAddress;
export const updateAddress = addressService.updateAddress;
export const deleteAddress = addressService.deleteAddress;
export const setDefaultAddress = addressService.setDefaultAddress;

export default addressService;
