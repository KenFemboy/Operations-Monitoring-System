import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminOverallSummary = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/overall`);

export const getAdminSalesAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/sales`);

export const getAdminEmployeeAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/employees`);

export const getAdminAttendancePayrollAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/attendance-payroll`);

export const getAdminInventoryAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/inventory`);

export const getAdminFeedbackAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/feedback`);

export const getAdminIRNTEAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/ir-nte`);

export const getAdminLeavePlantillaAnalytics = () =>
  api.get(`${ADMIN_PREFIX}/dashboard/leave-plantilla`);

export const getOverallSummary = getAdminOverallSummary;
export const getSalesAnalytics = getAdminSalesAnalytics;
export const getEmployeeAnalytics = getAdminEmployeeAnalytics;
export const getAttendancePayrollAnalytics = getAdminAttendancePayrollAnalytics;
export const getInventoryAnalytics = getAdminInventoryAnalytics;
export const getFeedbackAnalytics = getAdminFeedbackAnalytics;
export const getIRNTEAnalytics = getAdminIRNTEAnalytics;
export const getLeavePlantillaAnalytics = getAdminLeavePlantillaAnalytics;
