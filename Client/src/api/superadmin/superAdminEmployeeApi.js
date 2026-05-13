import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";
const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };
const getConfig = (data) => (data instanceof FormData ? multipartConfig : undefined);

export const getSuperAdminEmployees = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees`);

export const createSuperAdminEmployee = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees`, data, getConfig(data));

export const updateSuperAdminEmployee = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/employees/${id}`, data, getConfig(data));

export const archiveSuperAdminEmployee = (id, reason = "") =>
  api.patch(`${SUPER_ADMIN_PREFIX}/employees/${id}/archive`, { reason });

export const deleteSuperAdminEmployee = (id, data = {}) =>
  archiveSuperAdminEmployee(id, data.reason || data.archiveReason || "");

export const getSuperAdminEmployeeFullDetails = (id) =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/${id}/details`);

export const getSuperAdminAttendance = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/attendance/list`);

export const createSuperAdminAttendance = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/attendance/create`, data);

export const getSuperAdminPayrolls = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/payroll/list`);

export const createSuperAdminPayroll = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/payroll/create`, data);

export const updateSuperAdminPayrollStatus = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/employees/payroll/${id}/status`, data);

export const getSuperAdminLeaves = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/leave/list`);

export const createSuperAdminLeave = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/leave/create`, data);

export const updateSuperAdminLeaveStatus = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/employees/leave/${id}/status`, data);

export const getSuperAdminContributions = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/contribution/list`);

export const createSuperAdminContribution = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/contribution/create`, data);

export const getSuperAdminIncidentReports = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/ir/list`);

export const createSuperAdminIncidentReport = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/ir/create`, data);

export const updateSuperAdminIncidentReportStatus = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/employees/ir/${id}/status`, data);

export const getSuperAdminNTEs = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/employees/nte/list`);

export const createSuperAdminNTE = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/employees/nte/create`, data);

export const updateSuperAdminNTEStatus = (id, data) =>
  api.put(`${SUPER_ADMIN_PREFIX}/employees/nte/${id}/status`, data);
