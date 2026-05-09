import { getUserBranchId, isSuperAdmin } from "./accessControl.js";

const normalizeRole = (role) =>
  (role || "").toString().toLowerCase().replace(/[_\s]/g, "");

export const branchScopeMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isSuperAdmin(req.user)) {
    req.branchFilter = {};
    req.branchScope = {};
    return next();
  }

  const role = normalizeRole(req.user.role);

  if (["admin", "consoleuser"].includes(role)) {
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

  return res.status(403).json({ message: "Forbidden: unsupported role" });
};

export default branchScopeMiddleware;
