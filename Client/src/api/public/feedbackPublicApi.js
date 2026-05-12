import api from "../axiosInstance";

const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };
const getConfig = (data) => (data instanceof FormData ? multipartConfig : undefined);

export const createPublicFeedback = (data, branchSlug = "") =>
  api.post(
    branchSlug ? `/public/feedback/${branchSlug}` : "/public/feedback",
    data,
    getConfig(data)
  );

export const getPublicFeedbackFormConfig = (branchSlug = "") =>
  api.get(
    branchSlug
      ? `/public/feedback/config/${branchSlug}`
      : "/public/feedback/config"
  );
