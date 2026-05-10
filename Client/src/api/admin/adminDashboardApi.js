import api from "../axiosInstance";

export const getAdminOverallSummary = () =>
  api.get("/dashboard/overall");

export const getAdminSalesAnalytics = () =>
  api.get("/dashboard/sales");

export const getAdminEmployeeAnalytics = () =>
  api.get("/dashboard/employees");

export const getAdminAttendancePayrollAnalytics = () =>
  api.get("/dashboard/attendance-payroll");

export const getAdminInventoryAnalytics = () =>
  api.get("/dashboard/inventory");

export const getAdminFeedbackAnalytics = () =>
  api.get("/dashboard/feedback");

export const getAdminIRNTEAnalytics = () =>
  api.get("/dashboard/ir-nte");

export const getAdminLeavePlantillaAnalytics = () =>
  api.get("/dashboard/leave-plantilla");

export const getOverallSummary = getAdminOverallSummary;
export const getSalesAnalytics = getAdminSalesAnalytics;
export const getEmployeeAnalytics = getAdminEmployeeAnalytics;
export const getAttendancePayrollAnalytics = getAdminAttendancePayrollAnalytics;
export const getInventoryAnalytics = getAdminInventoryAnalytics;
export const getFeedbackAnalytics = getAdminFeedbackAnalytics;
export const getIRNTEAnalytics = getAdminIRNTEAnalytics;
export const getLeavePlantillaAnalytics = getAdminLeavePlantillaAnalytics;
