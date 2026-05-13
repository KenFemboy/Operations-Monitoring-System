import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminSales = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/sales`, { params });

export const createSuperAdminSale = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/sales`, data);

export const getSuperAdminDailySales = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/sales/daily`, { params });

export const getSuperAdminMonthlySales = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/sales/monthly`, { params });

export const archiveSuperAdminSale = (id, reason = "") =>
  api.patch(`${SUPER_ADMIN_PREFIX}/sales/${id}/archive`, { reason });

export const deleteSuperAdminSale = (id) =>
  archiveSuperAdminSale(id);
