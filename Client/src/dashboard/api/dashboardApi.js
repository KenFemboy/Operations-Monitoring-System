import api from "../../api/axios";

const API_URL = "/dashboard";

export const getOverallSummary = () => {
  return api.get(`${API_URL}/overall`);
};

export const getSalesAnalytics = () => {
  return api.get(`${API_URL}/sales`);
};

export const getEmployeeAnalytics = () => {
  return api.get(`${API_URL}/employees`);
};

export const getAttendancePayrollAnalytics = () => {
  return api.get(`${API_URL}/attendance-payroll`);
};

export const getInventoryAnalytics = () => {
  return api.get(`${API_URL}/inventory`);
};

export const getFeedbackAnalytics = () => {
  return api.get(`${API_URL}/feedback`);
};

export const getIRNTEAnalytics = () => {
  return api.get(`${API_URL}/ir-nte`);
};

export const getLeavePlantillaAnalytics = () => {
  return api.get(`${API_URL}/leave-plantilla`);
};