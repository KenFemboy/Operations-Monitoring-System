import api from "../axiosInstance";

const INVENTORY_PREFIX = "/inventory";

export const getAdminProducts = (params = {}) =>
  api.get(`${INVENTORY_PREFIX}/products`, { params });

export const createAdminProduct = (data) =>
  api.post(`${INVENTORY_PREFIX}/products`, data);

export const updateAdminProduct = (id, data) =>
  api.put(`${INVENTORY_PREFIX}/products/${id}`, data);

export const archiveAdminProduct = (id, reason = "") =>
  api.patch(`${INVENTORY_PREFIX}/products/${id}/archive`, { reason });

export const deleteAdminProduct = (id) =>
  archiveAdminProduct(id);

export const getAdminPurchases = (params = {}) =>
  api.get(`${INVENTORY_PREFIX}/purchases`, { params });

export const createAdminPurchase = (data) =>
  api.post(`${INVENTORY_PREFIX}/purchases`, data);

export const receiveAdminPurchase = (id) =>
  api.patch(`${INVENTORY_PREFIX}/purchases/${id}/receive`);

export const cancelAdminPurchase = (id) =>
  api.patch(`${INVENTORY_PREFIX}/purchases/${id}/cancel`);

export const archiveAdminPurchase = (id, reason = "") =>
  api.patch(`${INVENTORY_PREFIX}/purchases/${id}/archive`, { reason });

export const getAdminStockIns = (params = {}) =>
  api.get(`${INVENTORY_PREFIX}/stock-in`, { params });

export const createAdminStockIn = (data) =>
  api.post(`${INVENTORY_PREFIX}/stock-in`, data);

export const archiveAdminStockIn = (id, reason = "") =>
  api.patch(`${INVENTORY_PREFIX}/stock-in/${id}/archive`, { reason });

export const getAdminStockOuts = (params = {}) =>
  api.get(`${INVENTORY_PREFIX}/stock-out`, { params });

export const createAdminStockOut = (data) =>
  api.post(`${INVENTORY_PREFIX}/stock-out`, data);

export const archiveAdminStockOut = (id, reason = "") =>
  api.patch(`${INVENTORY_PREFIX}/stock-out/${id}/archive`, { reason });

export const getAdminInventoryRecords = (params = {}) =>
  api.get(`${INVENTORY_PREFIX}/records`, { params });

export const getProducts = getAdminProducts;
export const createProduct = createAdminProduct;
export const updateProduct = updateAdminProduct;
export const archiveProduct = archiveAdminProduct;
export const deleteProduct = deleteAdminProduct;
export const getPurchases = getAdminPurchases;
export const createPurchase = createAdminPurchase;
export const receivePurchase = receiveAdminPurchase;
export const cancelPurchase = cancelAdminPurchase;
export const archivePurchase = archiveAdminPurchase;
export const getStockIns = getAdminStockIns;
export const createStockIn = createAdminStockIn;
export const archiveStockIn = archiveAdminStockIn;
export const getStockOuts = getAdminStockOuts;
export const createStockOut = createAdminStockOut;
export const archiveStockOut = archiveAdminStockOut;
export const getInventoryRecords = (startDate, endDate, type = "all", branchId = "") =>
  getAdminInventoryRecords({ startDate, endDate, type, ...(branchId ? { branchId } : {}) });
