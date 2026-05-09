import api from "../axiosInstance";

const ADMIN_PREFIX = "/admin";

export const getAdminPlantillas = () =>
  api.get(`${ADMIN_PREFIX}/plantilla`);

export const createAdminPlantilla = (data) =>
  api.post(`${ADMIN_PREFIX}/plantilla`, data);

export const updateAdminPlantilla = (id, data) =>
  api.put(`${ADMIN_PREFIX}/plantilla/${id}`, data);

export const deleteAdminPlantilla = (id) =>
  api.delete(`${ADMIN_PREFIX}/plantilla/${id}`);

export const getAdminPlantillaById = (id) =>
  api.get(`${ADMIN_PREFIX}/plantilla/${id}`);

export const getPlantillas = getAdminPlantillas;
export const createPlantilla = createAdminPlantilla;
export const updatePlantilla = updateAdminPlantilla;
export const deletePlantilla = deleteAdminPlantilla;
export const getPlantillaById = getAdminPlantillaById;
