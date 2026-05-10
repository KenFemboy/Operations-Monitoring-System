import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminLeaves = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/leave/list`, { params });

export const createAdminLeave = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/leave/create`, data);

export const updateAdminLeaveStatus = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/leave/${id}/status`, data);

export const getLeaves = getAdminLeaves;
export const createLeave = createAdminLeave;
export const updateLeave = (id, data) =>
  api.put(`${EMPLOYEE_PREFIX}/leave/${id}`, data);
export const updateLeaveStatus = (id, status) =>
  updateAdminLeaveStatus(id, { status });
