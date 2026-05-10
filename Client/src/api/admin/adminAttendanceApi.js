import api from "../axiosInstance";

const EMPLOYEE_PREFIX = "/employees";

export const getAdminAttendance = (params = {}) =>
  api.get(`${EMPLOYEE_PREFIX}/attendance/list`, { params });

export const createAdminAttendance = (data) =>
  api.post(`${EMPLOYEE_PREFIX}/attendance/create`, data);

export const getAttendance = getAdminAttendance;
export const createAttendance = createAdminAttendance;
