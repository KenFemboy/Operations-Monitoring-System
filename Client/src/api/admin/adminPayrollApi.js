import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminPayrolls = () =>
  api.get(`${ADMIN_PREFIX}/employees/payroll/list`);

export const createAdminPayroll = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/payroll/create`, data);

export const updateAdminPayrollStatus = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/payroll/${id}/status`, data);

export const getPayrolls = getAdminPayrolls;
export const createPayroll = createAdminPayroll;
export const updatePayrollStatus = (id, status) =>
  updateAdminPayrollStatus(id, { status });
