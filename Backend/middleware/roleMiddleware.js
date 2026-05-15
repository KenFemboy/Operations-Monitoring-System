import { normalizeRole } from "../utils/roles.js";

export const allowRoles = (...roles) => {
  const allowed = new Set(roles.map(normalizeRole));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userRole = normalizeRole(req.user.role);

    if (!allowed.has(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: insufficient role",
      });
    }

    next();
  };
};

export default allowRoles;
