import axios from "axios";

const API_URL = "http://localhost:8000/api/plantilla";

export const getPlantillas = () => {
  return axios.get(API_URL);
};

export const createPlantilla = (data) => {
  return axios.post(API_URL, data);
};

export const getPlantillaById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updatePlantilla = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deletePlantilla = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};