import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminIncidentReports = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/ir/list`, { params });

export const createAdminIncidentReport = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/ir/create`, data);

export const updateAdminIncidentReportStatus = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/ir/${id}/status`, data);

export const getIncidentReports = getAdminIncidentReports;
export const createIncidentReport = createAdminIncidentReport;
export const updateIncidentReportStatus = (id, status) =>
  updateAdminIncidentReportStatus(id, { status });
