// middleware/branchScope.js
export const branchScope = (req, res, next) => {
  req.branchFilter = {};

  next();
};
