import mongoose from "mongoose";

const SUPER_ADMIN_ROLES = new Set(["super_admin", "superadmin"]);
const BRANCH_SCOPED_ROLES = new Set(["admin", "hr", "console_user"]);

export const isSuperAdmin = (user) => SUPER_ADMIN_ROLES.has(user?.role);

export const getUserBranchId = (user) => {
  const branchId = user?.branchId;

  if (!branchId) {
    return null;
  }

  if (typeof branchId === "object" && branchId._id) {
    return String(branchId._id);
  }

  return String(branchId);
};

export const assertValidObjectId = (value, fieldName = "id") => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${fieldName}`);
    error.statusCode = 400;
    throw error;
  }
};

export const canAccessBranch = (user, branchId) => {
  if (isSuperAdmin(user)) {
    return true;
  }

  const userBranchId = getUserBranchId(user);
  return Boolean(userBranchId && String(branchId) === userBranchId);
};

export const requireBranchAccess = (branchIdGetter) => {
  return (req, res, next) => {
    const branchId = branchIdGetter(req);

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "branchId is required",
      });
    }

    if (!canAccessBranch(req.user, branchId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: you can only access your assigned branch",
      });
    }

    next();
  };
};

export const attachBranchScope = (req, _res, next) => {
  if (isSuperAdmin(req.user)) {
    req.branchScope = {};
    return next();
  }

  if (BRANCH_SCOPED_ROLES.has(req.user?.role)) {
    const branchId = getUserBranchId(req.user);
    req.branchScope = branchId ? { branchId } : { branchId: null };
    return next();
  }

  req.branchScope = { branchId: null };
  next();
};
