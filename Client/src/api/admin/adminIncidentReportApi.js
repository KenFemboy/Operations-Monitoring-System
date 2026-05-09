import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminIncidentReports = () =>
  api.get(`${ADMIN_PREFIX}/employees/ir/list`);

export const createAdminIncidentReport = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/ir/create`, data);

export const updateAdminIncidentReportStatus = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/ir/${id}/status`, data);

export const getIncidentReports = getAdminIncidentReports;
export const createIncidentReport = createAdminIncidentReport;
export const updateIncidentReportStatus = (id, status) =>
  updateAdminIncidentReportStatus(id, { status });
