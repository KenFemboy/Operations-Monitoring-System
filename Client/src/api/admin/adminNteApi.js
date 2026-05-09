import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminNTEs = () =>
  api.get(`${ADMIN_PREFIX}/employees/nte/list`);

export const createAdminNTE = (data) =>
  api.post(`${ADMIN_PREFIX}/employees/nte/create`, data);

export const updateAdminNTEStatus = (id, data) =>
  api.put(`${ADMIN_PREFIX}/employees/nte/${id}/status`, data);

export const getNTEs = getAdminNTEs;
export const createNTE = createAdminNTE;
export const updateNTEStatus = (id, status) =>
  updateAdminNTEStatus(id, { status });
