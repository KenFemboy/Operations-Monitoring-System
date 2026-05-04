import api from "../../api/axios";

const API_URL = "/sales";

export const createSale = (data) => {
  return api.post(API_URL, data);
};

export const getSales = (startDate, endDate, serviceType = "all") => {
  return api.get(API_URL, {
    params: {
      startDate,
      endDate,
      serviceType,
    },
  });
};

export const getDailySales = (date) => {
  return api.get(`${API_URL}/daily`, {
    params: { date },
  });
};

export const getMonthlySales = (year, month) => {
  return api.get(`${API_URL}/monthly`, {
    params: { year, month },
  });
};

export const deleteSale = (id) => {
  return api.delete(`${API_URL}/${id}`);
};