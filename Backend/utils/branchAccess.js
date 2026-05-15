import { isSuperAdminRole, normalizeRole } from "./roles.js";

const FORBIDDEN_BRANCH_MESSAGE = "You are not allowed to access this branch record";

export const getBranchIdValue = (branch) => {
  if (!branch) return null;
  if (typeof branch === "object" && branch._id) return String(branch._id);
  return String(branch);
};

export const getUserBranchId = (user) => getBranchIdValue(user?.branchId);

export const isSuperAdmin = (user) => isSuperAdminRole(user?.role);

export const getBranchFilter = (req, branchField = "branch") => {
  const user = req?.user || req;

  if (!user || isSuperAdmin(user)) {
    return {};
  }

  const branchId = getUserBranchId(user);

  return branchId ? { [branchField]: branchId } : { [branchField]: null };
};

export const resolveRecordBranch = (req, bodyBranch) => {
  if (isSuperAdmin(req.user)) {
    return bodyBranch || null;
  }

  return getUserBranchId(req.user);
};

export const assertCanAccessBranch = (req, recordBranch) => {
  if (isSuperAdmin(req.user)) {
    return true;
  }

  const userBranchId = getUserBranchId(req.user);
  const recordBranchId = getBranchIdValue(recordBranch);

  if (!userBranchId || !recordBranchId || userBranchId !== recordBranchId) {
    const error = new Error(FORBIDDEN_BRANCH_MESSAGE);
    error.statusCode = 403;
    throw error;
  }

  return true;
};

export const normalizeUserAuthShape = (userDoc) => {
  if (!userDoc) return null;

  const populatedBranch =
    userDoc.branchId && typeof userDoc.branchId === "object" ? userDoc.branchId : null;
  const branchName = populatedBranch?.branchName || userDoc.branch || null;

  return {
    id: userDoc._id,
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: normalizeRole(userDoc.role),
    branch: branchName,
    branchName,
    branchLocation: populatedBranch?.location || null,
    branchAddress: populatedBranch?.address || null,
    branchId: populatedBranch?._id || userDoc.branchId || null,
  };
};

export { FORBIDDEN_BRANCH_MESSAGE };

