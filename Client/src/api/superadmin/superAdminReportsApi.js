import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminReports = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/reports/archive`, { params });

export const restoreSuperAdminReportEntry = (entryId, data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/reports/archive/${entryId}/restore`, data);

export const clearSuperAdminReportsArchive = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/reports/archive/clear-all`, data);
