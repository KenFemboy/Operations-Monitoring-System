import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminFeedback = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/feedback`, { params });

export const getSuperAdminFeedbackAnalytics = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/feedback/analytics`, { params });

export const getSuperAdminAverageRatingByBranch = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/feedback/summary/by-branch`, { params });

export const getSuperAdminAverageRatingByMonth = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/feedback/summary/by-month`, { params });

export const createSuperAdminFeedback = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/feedback`, data);

export const archiveSuperAdminFeedback = (id, reason = "") =>
  api.patch(`${SUPER_ADMIN_PREFIX}/feedback/${id}/archive`, { reason });

export const deleteSuperAdminFeedback = (id) =>
  archiveSuperAdminFeedback(id);
