import api from "../axiosInstance";

const FEEDBACK_PREFIX = "/feedback";

export const getAdminFeedback = (params = {}) =>
  api.get(FEEDBACK_PREFIX, { params });

export const getAdminFeedbackAnalytics = (params = {}) =>
  api.get(`${FEEDBACK_PREFIX}/analytics`, { params });

export const getAdminAverageRatingByBranch = (params = {}) =>
  api.get(`${FEEDBACK_PREFIX}/summary/by-branch`, { params });

export const getAdminAverageRatingByMonth = (params = {}) =>
  api.get(`${FEEDBACK_PREFIX}/summary/by-month`, { params });

export const createAdminFeedback = (data) =>
  api.post(FEEDBACK_PREFIX, data);

export const deleteAdminFeedback = (id) =>
  api.delete(`${FEEDBACK_PREFIX}/${id}`);

export const createFeedback = createAdminFeedback;
export const getFeedbacks = getAdminFeedback;
export const getAverageRatingByBranch = getAdminAverageRatingByBranch;
export const getAverageRatingByMonth = getAdminAverageRatingByMonth;
export const deleteFeedback = deleteAdminFeedback;
