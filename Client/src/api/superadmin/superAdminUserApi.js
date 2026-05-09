import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getBranchAdmins = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/users`);

export const createBranchAdmin = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/users`, data);

export const updateBranchAdmin = (userId, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/users/${userId}`, data);

export const deleteBranchAdmin = (userId, data) =>
  api.delete(`${SUPER_ADMIN_PREFIX}/users/${userId}`, { data });
