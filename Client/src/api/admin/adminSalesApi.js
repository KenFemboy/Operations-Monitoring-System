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

export const deleteAdminSale = (id) =>
  api.delete(`${SALES_PREFIX}/${id}`);

export const createSale = createAdminSale;
export const getSales = (startDate, endDate, serviceType = "all", branchId = "") =>
  getAdminSales({ startDate, endDate, serviceType, ...(branchId ? { branchId } : {}) });
export const getDailySales = (date, branchId = "") =>
  getAdminDailySales({ date, ...(branchId ? { branchId } : {}) });
export const getMonthlySales = (year, month, branchId = "") =>
  getAdminMonthlySales({ year, month, ...(branchId ? { branchId } : {}) });
export const deleteSale = deleteAdminSale;
