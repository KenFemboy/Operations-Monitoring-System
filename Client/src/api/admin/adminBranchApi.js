import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminBranches = () => api.get(`${ADMIN_PREFIX}/branches`);

export const getBranches = getAdminBranches;
