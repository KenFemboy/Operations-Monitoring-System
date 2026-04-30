import axios from "axios";

const API_URL = "http://localhost:8000/api/plantilla";

export const getPlantillas = () => {
  return axios.get(`${API_URL}/list`);
};

export const createPlantilla = (data) => {
  return axios.post(`${API_URL}/create`, data);
};