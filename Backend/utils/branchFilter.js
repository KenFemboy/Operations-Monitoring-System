import { getBranchFilter as getBranchAccessFilter } from "./branchAccess.js";

export const getBranchFilter = (context, branchField = "branch") => {
  if (context?.branchFilter && branchField === "branch") {
    return context.branchFilter;
  }

  return getBranchAccessFilter(context, branchField);
};

export default getBranchFilter;
