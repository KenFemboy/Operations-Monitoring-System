import axios from "axios";

const API_URL = "http://localhost:8000/api/dashboard";

export const getOverallSummary = () => {
  return axios.get(`${API_URL}/overall`);
};

export const getSalesAnalytics = () => {
  return axios.get(`${API_URL}/sales`);
};

export const getEmployeeAnalytics = () => {
  return axios.get(`${API_URL}/employees`);
};

export const getAttendancePayrollAnalytics = () => {
  return axios.get(`${API_URL}/attendance-payroll`);
};

export const getInventoryAnalytics = () => {
  return axios.get(`${API_URL}/inventory`);
};

export const getFeedbackAnalytics = () => {
  return axios.get(`${API_URL}/feedback`);
};

export const getIRNTEAnalytics = () => {
  return axios.get(`${API_URL}/ir-nte`);
};

export const getLeavePlantillaAnalytics = () => {
  return axios.get(`${API_URL}/leave-plantilla`);
};