import api from "../../api/axios";

const API_URL = "/branches";

export const getBranches = () => {
  return api.get(API_URL);
};

export const createBranch = (data) => {
  return api.post(API_URL, data);
};

export const updateBranch = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deleteBranch = (id) => {
  return api.delete(`${API_URL}/${id}`);
};