import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminEmployees = () => api.get(`${ADMIN_PREFIX}/employees`);

export const createAdminEmployee = (data) =>
  api.post(`${ADMIN_PREFIX}/employees`, data);

export const updateAdminEmployee = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/${id}`, data);

export const deleteAdminEmployee = (id) =>
  api.delete(`${ADMIN_PREFIX}/employees/${id}`);

export const getAdminEmployeeFullDetails = (id) =>
  api.get(`${ADMIN_PREFIX}/employees/${id}/details`);

export const getEmployees = getAdminEmployees;
export const createEmployee = createAdminEmployee;
export const updateEmployee = updateAdminEmployee;
export const deleteEmployee = deleteAdminEmployee;
export const getEmployeeFullDetails = getAdminEmployeeFullDetails;
