import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminSales = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/sales`, { params });

export const createAdminSale = (data) =>
  api.post(`${ADMIN_PREFIX}/sales`, data);

export const getAdminDailySales = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/sales/daily`, { params });

export const getAdminMonthlySales = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/sales/monthly`, { params });

export const deleteAdminSale = (id) =>
  api.delete(`${ADMIN_PREFIX}/sales/${id}`);

export const createSale = createAdminSale;
export const getSales = (startDate, endDate, serviceType = "all") =>
  getAdminSales({ startDate, endDate, serviceType });
export const getDailySales = (date) => getAdminDailySales({ date });
export const getMonthlySales = (year, month) =>
  getAdminMonthlySales({ year, month });
export const deleteSale = deleteAdminSale;
