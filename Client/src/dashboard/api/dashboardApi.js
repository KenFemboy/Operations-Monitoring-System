import api from "../../api/axios";

const API_URL = "/dashboard";

export const getDashboardAnalytics = () => {
  return api.get(`${API_URL}/analytics`);
};