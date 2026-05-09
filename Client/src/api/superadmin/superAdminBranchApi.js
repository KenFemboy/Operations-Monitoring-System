import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getBranches = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/branches`);

export const createBranch = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/branches`, data);

export const updateBranch = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/branches/${id}`, data);

export const deleteBranch = (id) =>
  api.delete(`${SUPER_ADMIN_PREFIX}/branches/${id}`);
