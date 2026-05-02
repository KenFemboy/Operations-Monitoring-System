import axios from "axios";

const API_URL = "http://localhost:8000/api/feedback";

export const createFeedback = (data) => {
  return axios.post(API_URL, data);
};

export const getFeedbacks = ({
  startDate = "",
  endDate = "",
  branch = "all",
  mealSession = "all",
} = {}) => {
  return axios.get(API_URL, {
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
  return axios.get(`${API_URL}/summary/by-branch`, {
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
  return axios.get(`${API_URL}/summary/by-month`, {
    params: {
      branch,
      mealSession,
    },
  });
};

export const deleteFeedback = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};