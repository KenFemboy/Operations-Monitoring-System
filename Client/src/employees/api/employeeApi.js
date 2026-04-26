import axios from "axios";

const API_URL = "http://localhost:8000/api/employees";

// Employees
export const getEmployees = () => axios.get(API_URL);
export const createEmployee = (data) => axios.post(API_URL, data);
export const updateEmployee = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${API_URL}/${id}`);

// Attendance
export const createAttendance = (data) =>
  axios.post(`${API_URL}/attendance/create`, data);

export const getAttendance = () =>
  axios.get(`${API_URL}/attendance/list`);

// Payroll
export const createPayroll = (data) =>
  axios.post(`${API_URL}/payroll/create`, data);

export const updatePayrollStatus = (id, status) =>
  axios.put(`${API_URL}/payroll/${id}/status`, { status });
export const getPayrolls = () =>
  axios.get(`${API_URL}/payroll/list`);

// Leave
export const createLeave = (data) =>
  axios.post(`${API_URL}/leave/create`, data);
export const updateLeave = (id, data) =>
  axios.put(`${API_URL}/leave/${id}`, data);
export const getLeaves = () =>
  axios.get(`${API_URL}/leave/list`);

export const updateLeaveStatus = (id, status) =>
  axios.put(`${API_URL}/leave/${id}/status`, { status });

// Contributions
export const createContribution = (data) =>
  axios.post(`${API_URL}/contribution/create`, data);

export const getContributions = () =>
  axios.get(`${API_URL}/contribution/list`);

// IR
export const createIncidentReport = (data) =>
  axios.post(`${API_URL}/ir/create`, data);

export const getIncidentReports = () =>
  axios.get(`${API_URL}/ir/list`);

// NTE
export const createNTE = (data) =>
  axios.post(`${API_URL}/nte/create`, data);

export const getNTEs = () =>
  axios.get(`${API_URL}/nte/list`);

export const getEmployeeFullDetails = (id) =>
  axios.get(`${API_URL}/${id}/details`);