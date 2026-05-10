import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminPayrolls = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/payroll/list`, { params });

export const createAdminPayroll = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/payroll/create`, data);

export const updateAdminPayrollStatus = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/payroll/${id}/status`, data);

export const getPayrolls = getAdminPayrolls;
export const createPayroll = createAdminPayroll;
export const updatePayrollStatus = (id, status) =>
  updateAdminPayrollStatus(id, { status });
