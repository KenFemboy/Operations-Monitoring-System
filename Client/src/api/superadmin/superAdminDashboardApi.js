import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminOverallSummary = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/overall`);

export const getSuperAdminSalesAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/sales`);

export const getSuperAdminEmployeeAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/employees`);

export const getSuperAdminAttendancePayrollAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/attendance-payroll`);

export const getSuperAdminInventoryAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/inventory`);

export const getSuperAdminFeedbackAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/feedback`);

export const getSuperAdminIRNTEAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/ir-nte`);

export const getSuperAdminLeavePlantillaAnalytics = () =>
  api.get(`${SUPER_ADMIN_PREFIX}/dashboard/leave-plantilla`);
