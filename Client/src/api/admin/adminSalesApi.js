import api from "../axiosInstance";

const SALES_PREFIX = "/sales";

export const getAdminSales = (params = {}) =>
  api.get(SALES_PREFIX, { params });

export const createAdminSale = (data) =>
  api.post(SALES_PREFIX, data);

export const getAdminDailySales = (params = {}) =>
  api.get(`${SALES_PREFIX}/daily`, { params });

export const getAdminMonthlySales = (params = {}) =>
  api.get(`${SALES_PREFIX}/monthly`, { params });

export const archiveAdminSale = (id, reason = "") =>
  api.patch(`${SALES_PREFIX}/${id}/archive`, { reason });

export const deleteAdminSale = (id) =>
  archiveAdminSale(id);

export const createSale = createAdminSale;
export const getSales = (startDate, endDate, serviceType = "all", branchId = "") =>
  getAdminSales({ startDate, endDate, serviceType, ...(branchId ? { branchId } : {}) });
export const getDailySales = (date, branchId = "") =>
  getAdminDailySales({ date, ...(branchId ? { branchId } : {}) });
export const getMonthlySales = (year, month, branchId = "") =>
  getAdminMonthlySales({ year, month, ...(branchId ? { branchId } : {}) });
export const archiveSale = archiveAdminSale;
export const deleteSale = deleteAdminSale;
