export {
  canAccessBranch,
  requireBranchAccess as requireBranchAccessFromGetter,
} from "./accessControl.js";

import { requireBranchAccess } from "./accessControl.js";

export const requireBranchAccessFromParam = (paramName = "branchId") =>
  requireBranchAccess((req) => req.params[paramName]);

export const requireBranchAccessFromBody = (fieldName = "branchId") =>
  requireBranchAccess((req) => req.body[fieldName]);
