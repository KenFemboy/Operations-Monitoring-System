import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminNTEs = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/nte/list`, { params });

export const createAdminNTE = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/nte/create`, data);

export const updateAdminNTEStatus = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/nte/${id}/status`, data);

export const getNTEs = getAdminNTEs;
export const createNTE = createAdminNTE;
export const updateNTEStatus = (id, status) =>
  updateAdminNTEStatus(id, { status });
