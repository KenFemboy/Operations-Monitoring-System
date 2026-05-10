import api from "../axiosInstance";

export const createPublicFeedback = (data, branchSlug = "") =>
  api.post(
    branchSlug ? `/public/feedback/${branchSlug}` : "/public/feedback",
    data
  );

export const getPublicFeedbackFormConfig = (branchSlug = "") =>
  api.get(
    branchSlug
      ? `/public/feedback/config/${branchSlug}`
      : "/public/feedback/config"
  );
