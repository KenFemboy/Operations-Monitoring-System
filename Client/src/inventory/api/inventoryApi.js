import api from "../../api/axios";

const API_URL = "/inventory";

// Products
export const getProducts = () => {
  return api.get(`${API_URL}/products`);
};

export const createProduct = (data) => {
  return api.post(`${API_URL}/products`, data);
};

export const getProductById = (id) => {
  return api.get(`${API_URL}/products/${id}`);
};

export const updateProduct = (id, data) => {
  return api.put(`${API_URL}/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`${API_URL}/products/${id}`);
};

// Purchases
export const getPurchases = () => {
  return api.get(`${API_URL}/purchases`);
};

export const createPurchase = (data) => {
  return api.post(`${API_URL}/purchases`, data);
};

export const receivePurchase = (id) => {
  return api.patch(`${API_URL}/purchases/${id}/receive`);
};

export const cancelPurchase = (id) => {
  return api.patch(`${API_URL}/purchases/${id}/cancel`);
};

// Stock In
export const getStockIns = () => {
  return api.get(`${API_URL}/stock-in`);
};

export const createStockIn = (data) => {
  return api.post(`${API_URL}/stock-in`, data);
};

// Stock Out
export const getStockOuts = () => {
  return api.get(`${API_URL}/stock-out`);
};

export const createStockOut = (data) => {
  return api.post(`${API_URL}/stock-out`, data);
};

export const getInventoryRecords = (startDate, endDate, type = "all") => {
  return api.get(`${API_URL}/records`, {
    params: {
      startDate,
      endDate,
      type,
    },
  });
};