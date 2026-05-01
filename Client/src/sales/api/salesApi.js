import axios from "axios";

const API_URL = "http://localhost:8000/api/sales";

export const createSale = (data) => {
  return axios.post(API_URL, data);
};

export const getSales = (startDate, endDate, serviceType = "all") => {
  return axios.get(API_URL, {
    params: {
      startDate,
      endDate,
      serviceType,
    },
  });
};

export const getDailySales = (date) => {
  return axios.get(`${API_URL}/daily`, {
    params: { date },
  });
};

export const getMonthlySales = (year, month) => {
  return axios.get(`${API_URL}/monthly`, {
    params: { year, month },
  });
};

export const deleteSale = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};