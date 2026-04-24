// middleware/branchScope.js
export const branchScope = (req, res, next) => {
  const user = req.user;

  if (user.role === "super_admin") {
    req.branchFilter = {}; // no restriction
  } else {
    req.branchFilter = { branchId: user.branchId };
  }

  next();
};