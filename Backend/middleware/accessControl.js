import mongoose from "mongoose";
import {
  getBranchIdValue,
  getUserBranchId,
  isSuperAdmin,
} from "../utils/branchAccess.js";

export { getUserBranchId, isSuperAdmin };

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
  return Boolean(userBranchId && getBranchIdValue(branchId) === userBranchId);
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

  if (["admin", "console_user"].includes(req.user?.role)) {
    const branchId = getUserBranchId(req.user);
    req.branchScope = branchId ? { branchId } : { branchId: null };
    return next();
  }

  req.branchScope = { branchId: null };
  next();
};
