import api from "../../api/axios";

const API_URL = "/employees";

// Employees
export const getEmployees = () => api.get(API_URL);
export const createEmployee = (data) => api.post(API_URL, data);
export const updateEmployee = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteEmployee = (id) => api.delete(`${API_URL}/${id}`);

// Attendance
export const createAttendance = (data) =>
  api.post(`${API_URL}/attendance/create`, data);

export const getAttendance = () =>
  api.get(`${API_URL}/attendance/list`);

// Payroll
export const createPayroll = (data) =>
  api.post(`${API_URL}/payroll/create`, data);

export const updatePayrollStatus = (id, status) =>
  api.put(`${API_URL}/payroll/${id}/status`, { status });
export const getPayrolls = () =>
  api.get(`${API_URL}/payroll/list`);

// Leave
export const createLeave = (data) =>
  api.post(`${API_URL}/leave/create`, data);
export const updateLeave = (id, data) =>
  api.put(`${API_URL}/leave/${id}`, data);
export const getLeaves = () =>
  api.get(`${API_URL}/leave/list`);

export const updateLeaveStatus = (id, status) =>
  api.put(`${API_URL}/leave/${id}/status`, { status });

// Contributions
export const createContribution = (data) =>
  api.post(`${API_URL}/contribution/create`, data);

export const getContributions = () =>
  api.get(`${API_URL}/contribution/list`);

// IR
export const createIncidentReport = (data) =>
  api.post(`${API_URL}/ir/create`, data);

export const getIncidentReports = () =>
  api.get(`${API_URL}/ir/list`);

export const updateIncidentReportStatus = (id, status) =>
  api.put(`${API_URL}/ir/${id}/status`, { status });

// NTE
export const createNTE = (data) =>
  api.post(`${API_URL}/nte/create`, data);

export const getNTEs = () =>
  api.get(`${API_URL}/nte/list`);

export const updateNTEStatus = (id, status) =>
  api.put(`${API_URL}/nte/${id}/status`, { status });

export const getEmployeeFullDetails = (id) =>
  api.get(`${API_URL}/${id}/details`);
