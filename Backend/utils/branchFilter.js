import { isSuperAdmin } from "../middleware/accessControl.js";

export const getBranchFilter = (context) => {
  if (context?.branchFilter) {
    return context.branchFilter;
  }

  const user = context?.user || context;

  if (!user) return {};

  if (isSuperAdmin(user)) return {};

  const branchId = user.branchId || user.branch || null;

  if (!branchId) return { branch: null };

  return { branch: branchId };
};

export default getBranchFilter;
