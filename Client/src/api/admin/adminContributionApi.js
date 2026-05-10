import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminContributions = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/contribution/list`, { params });

export const createAdminContribution = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/contribution/create`, data);

export const getContributions = getAdminContributions;
export const createContribution = createAdminContribution;
