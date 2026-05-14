import api from "../axiosInstance";

const SUPER_ADMIN_PREFIX = "/superadmin";

export const getSuperAdminAdminArchive = (params = {}) =>
  api.get(`${SUPER_ADMIN_PREFIX}/adminArchive/archive`, { params });

export const restoreSuperAdminAdminArchiveEntry = (entryId, data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/adminArchive/archive/${entryId}/restore`, data);

export const clearSuperAdminAdminArchive = (data) =>
  api.post(`${SUPER_ADMIN_PREFIX}/adminArchive/archive/clear-all`, data);
