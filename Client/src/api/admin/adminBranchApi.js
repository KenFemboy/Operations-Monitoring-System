import api from "../axiosInstance";

export const getAdminBranches = () => api.get("/branches");

export const getBranches = getAdminBranches;
