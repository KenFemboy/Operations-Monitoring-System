import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminProducts = () =>
  api.get(`${ADMIN_PREFIX}/inventory/products`);

export const createAdminProduct = (data) =>
  api.post(`${ADMIN_PREFIX}/inventory/products`, data);

export const updateAdminProduct = (id, data) =>
  api.put(`${ADMIN_PREFIX}/inventory/products/${id}`, data);

export const deleteAdminProduct = (id) =>
  api.delete(`${ADMIN_PREFIX}/inventory/products/${id}`);

export const getAdminPurchases = () =>
  api.get(`${ADMIN_PREFIX}/inventory/purchases`);

export const createAdminPurchase = (data) =>
  api.post(`${ADMIN_PREFIX}/inventory/purchases`, data);

export const receiveAdminPurchase = (id) =>
  api.patch(`${ADMIN_PREFIX}/inventory/purchases/${id}/receive`);

export const cancelAdminPurchase = (id) =>
  api.patch(`${ADMIN_PREFIX}/inventory/purchases/${id}/cancel`);

export const getAdminStockIns = () =>
  api.get(`${ADMIN_PREFIX}/inventory/stock-in`);

export const createAdminStockIn = (data) =>
  api.post(`${ADMIN_PREFIX}/inventory/stock-in`, data);

export const getAdminStockOuts = () =>
  api.get(`${ADMIN_PREFIX}/inventory/stock-out`);

export const createAdminStockOut = (data) =>
  api.post(`${ADMIN_PREFIX}/inventory/stock-out`, data);

export const getAdminInventoryRecords = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/inventory/records`, { params });

export const getProducts = getAdminProducts;
export const createProduct = createAdminProduct;
export const updateProduct = updateAdminProduct;
export const deleteProduct = deleteAdminProduct;
export const getPurchases = getAdminPurchases;
export const createPurchase = createAdminPurchase;
export const receivePurchase = receiveAdminPurchase;
export const cancelPurchase = cancelAdminPurchase;
export const getStockIns = getAdminStockIns;
export const createStockIn = createAdminStockIn;
export const getStockOuts = getAdminStockOuts;
export const createStockOut = createAdminStockOut;
export const getInventoryRecords = (startDate, endDate, type = "all") =>
  getAdminInventoryRecords({ startDate, endDate, type });
