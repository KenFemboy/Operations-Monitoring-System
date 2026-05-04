import api from "../../api/axios";

const API_URL = "/plantilla";

export const getPlantillas = () => {
  return api.get(API_URL);
};

export const createPlantilla = (data) => {
  return api.post(API_URL, data);
};

export const getPlantillaById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

export const updatePlantilla = (id, data) => {
  return api.put(`${API_URL}/${id}`, data);
};

export const deletePlantilla = (id) => {
  return api.delete(`${API_URL}/${id}`);
};