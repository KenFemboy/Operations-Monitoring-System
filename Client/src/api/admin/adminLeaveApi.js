import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminLeaves = () =>
  api.get(`${ADMIN_PREFIX}/employees/leave/list`);

export const createAdminLeave = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/leave/create`, data);

export const updateAdminLeaveStatus = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/leave/${id}/status`, data);

export const getLeaves = getAdminLeaves;
export const createLeave = createAdminLeave;
export const updateLeave = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/leave/${id}`, data);
export const updateLeaveStatus = (id, status) =>
  updateAdminLeaveStatus(id, { status });
