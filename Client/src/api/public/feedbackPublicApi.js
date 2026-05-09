import api from "../axiosInstance";

export const createPublicFeedback = (data) =>
  api.post("/public/feedback", data);

export const getPublicFeedbackFormConfig = () =>
  api.get("/public/feedback/config");
