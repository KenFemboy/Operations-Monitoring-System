import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminAttendance = () =>
  api.get(`${ADMIN_PREFIX}/employees/attendance/list`);

export const createAdminAttendance = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/attendance/create`, data);

export const getAttendance = getAdminAttendance;
export const createAttendance = createAdminAttendance;
