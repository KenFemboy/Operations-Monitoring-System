import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminProducts = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/inventory/products`);

export const createSuperAdminProduct = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/inventory/products`, data);

export const updateSuperAdminProduct = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/inventory/products/${id}`, data);

export const deleteSuperAdminProduct = (id) =>
  api.delete(`${SUPER_ADMIN_PREFIX}/inventory/products/${id}`);

export const getSuperAdminPurchases = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/inventory/purchases`);

export const createSuperAdminPurchase = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/inventory/purchases`, data);

export const receiveSuperAdminPurchase = (id) =>
  api.patch(`${SUPER_ADMIN_PREFIX}/inventory/purchases/${id}/receive`);

export const cancelSuperAdminPurchase = (id) =>
  api.patch(`${SUPER_ADMIN_PREFIX}/inventory/purchases/${id}/cancel`);

export const getSuperAdminStockIns = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/inventory/stock-in`);

export const createSuperAdminStockIn = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/inventory/stock-in`, data);

export const getSuperAdminStockOuts = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/inventory/stock-out`);

export const createSuperAdminStockOut = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/inventory/stock-out`, data);

export const getSuperAdminInventoryRecords = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/inventory/records`, { params });
