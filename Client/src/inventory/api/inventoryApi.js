import axios from "axios";

const API_URL = "http://localhost:8000/api/inventory";

// Products
export const getProducts = () => {
  return axios.get(`${API_URL}/products`);
};

export const createProduct = (data) => {
  return axios.post(`${API_URL}/products`, data);
};

export const getProductById = (id) => {
  return axios.get(`${API_URL}/products/${id}`);
};

export const updateProduct = (id, data) => {
  return axios.put(`${API_URL}/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/products/${id}`);
};

// Purchases
export const getPurchases = () => {
  return axios.get(`${API_URL}/purchases`);
};

export const createPurchase = (data) => {
  return axios.post(`${API_URL}/purchases`, data);
};

export const receivePurchase = (id) => {
  return axios.patch(`${API_URL}/purchases/${id}/receive`);
};

export const cancelPurchase = (id) => {
  return axios.patch(`${API_URL}/purchases/${id}/cancel`);
};

// Stock In
export const getStockIns = () => {
  return axios.get(`${API_URL}/stock-in`);
};

export const createStockIn = (data) => {
  return axios.post(`${API_URL}/stock-in`, data);
};

// Stock Out
export const getStockOuts = () => {
  return axios.get(`${API_URL}/stock-out`);
};

export const createStockOut = (data) => {
  return axios.post(`${API_URL}/stock-out`, data);
};

export const getInventoryRecords = (startDate, endDate, type = "all") => {
  return axios.get(`${API_URL}/records`, {
    params: {
      startDate,
      endDate,
      type,
    },
  });
};