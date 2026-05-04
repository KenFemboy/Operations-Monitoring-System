import api from "../../api/axios";

const API_URL = "/feedback";

export const createFeedback = (data) => {
  return api.post(API_URL, data);
};

export const getFeedbacks = ({
  startDate = "",
  endDate = "",
  branch = "all",
  mealSession = "all",
} = {}) => {
  return api.get(API_URL, {
    params: {
      startDate,
      endDate,
      branch,
      mealSession,
    },
  });
};

export const getAverageRatingByBranch = ({
  startDate = "",
  endDate = "",
  mealSession = "all",
} = {}) => {
  return api.get(`${API_URL}/summary/by-branch`, {
    params: {
      startDate,
      endDate,
      mealSession,
    },
  });
};

export const getAverageRatingByMonth = ({
  branch = "all",
  mealSession = "all",
} = {}) => {
  return api.get(`${API_URL}/summary/by-month`, {
    params: {
      branch,
      mealSession,
    },
  });
};

export const deleteFeedback = (id) => {
  return api.delete(`${API_URL}/${id}`);
};