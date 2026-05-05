import api from "../../api/axios";

export const getBranchAdmins = () => {
  return api.get("/users");
};

export const createBranchAdmin = (data) => {
  return api.post("/users", data);
};

export const updateBranchAdmin = (userId, data) => {
  return api.put(`/users/${userId}`, data);
};

export const deleteBranchAdmin = (userId, data) => {
  return api.delete(`/users/${userId}`, {
    data,
  });
};

export const getBranches = () => {
  return api.get("/branches");
};