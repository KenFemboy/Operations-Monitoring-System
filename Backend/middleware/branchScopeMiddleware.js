import { getUserBranchId, isSuperAdmin } from "../utils/branchAccess.js";
import { normalizeRole } from "../utils/roles.js";

export const branchScopeMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (isSuperAdmin(req.user)) {
    req.branchFilter = {};
    req.branchScope = {};
    return next();
  }

  const role = normalizeRole(req.user.role);

  if (["admin", "console_user"].includes(role)) {
    const branchId = getUserBranchId(req.user);

    if (!branchId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: no branch assigned",
      });
    }

    req.branchFilter = { branch: branchId };
    req.branchScope = {
      branch: branchId,
      branchId,
      branchName: req.user.branch || null,
    };
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Forbidden: unsupported role",
  });
};

export default branchScopeMiddleware;
