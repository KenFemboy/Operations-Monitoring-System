import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminEmployees = (params = {}) =>
  api.get(EMPLOYEE_PREFIX, { params });

export const createAdminEmployee = (data) =>
  api.post(EMPLOYEE_PREFIX, data);

export const updateAdminEmployee = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/${id}`, data);

export const archiveAdminEmployee = (id, reason = "") =>
  api.patch(`${EMPLOYEE_PREFIX}/${id}/archive`, { reason });

export const deleteAdminEmployee = (id, data = {}) =>
  archiveAdminEmployee(id, data.reason || data.archiveReason || "");

export const getAdminEmployeeFullDetails = (id) =>
  api.get(`${EMPLOYEE_PREFIX}/${id}/details`);

export const getEmployees = getAdminEmployees;
export const createEmployee = createAdminEmployee;
export const updateEmployee = updateAdminEmployee;
export const archiveEmployee = archiveAdminEmployee;
export const deleteEmployee = deleteAdminEmployee;
export const getEmployeeFullDetails = getAdminEmployeeFullDetails;
