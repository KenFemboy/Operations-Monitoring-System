import axios from "axios";

const API_URL = "http://localhost:8000/api/feedback";

export const createFeedback = (data) => {
  return axios.post(API_URL, data);
};

export const getFeedbacks = (startDate = "", endDate = "") => {
  return axios.get(API_URL, {
    params: {
      startDate,
      endDate,
    },
  });
};
export const deleteFeedback = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};