import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";
const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };
const getConfig = (data) => (data instanceof FormData ? multipartConfig : undefined);

export const getAdminEmployees = (params = {}) =>
  api.get(EMPLOYEE_PREFIX, { params });

export const createAdminEmployee = (data) =>
  api.post(EMPLOYEE_PREFIX, data, getConfig(data));

export const updateAdminEmployee = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/${id}`, data, getConfig(data));

export const deleteAdminEmployee = (id, data = {}) =>
  api.delete(`${EMPLOYEE_PREFIX}/${id}`, { data });

export const getAdminEmployeeFullDetails = (id) =>
  api.get(`${EMPLOYEE_PREFIX}/${id}/details`);

export const getEmployees = getAdminEmployees;
export const createEmployee = createAdminEmployee;
export const updateEmployee = updateAdminEmployee;
export const deleteEmployee = deleteAdminEmployee;
export const getEmployeeFullDetails = getAdminEmployeeFullDetails;
