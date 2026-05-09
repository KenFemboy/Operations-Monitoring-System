import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminFeedback = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/feedback`, { params });

export const getAdminFeedbackAnalytics = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/feedback/analytics`, { params });

export const getAdminAverageRatingByBranch = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/feedback/summary/by-branch`, { params });

export const getAdminAverageRatingByMonth = (params = {}) =>
  api.get(`${ADMIN_PREFIX}/feedback/summary/by-month`, { params });

export const createAdminFeedback = (data) =>
  api.post(`${ADMIN_PREFIX}/feedback`, data);

export const deleteAdminFeedback = (id) =>
  api.delete(`${ADMIN_PREFIX}/feedback/${id}`);

export const createFeedback = createAdminFeedback;
export const getFeedbacks = getAdminFeedback;
export const getAverageRatingByBranch = getAdminAverageRatingByBranch;
export const getAverageRatingByMonth = getAdminAverageRatingByMonth;
export const deleteFeedback = deleteAdminFeedback;
