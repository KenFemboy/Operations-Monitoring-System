import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminContributions = () =>
  api.get(`${ADMIN_PREFIX}/employees/contribution/list`);

export const createAdminContribution = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/contribution/create`, data);

export const getContributions = getAdminContributions;
export const createContribution = createAdminContribution;
