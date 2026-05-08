export const allowRoles = (...roles) => {
  const normalize = (r) => (r || "").toString().toLowerCase().replace(/[_\s]/g, "");
  const allowed = new Set(roles.map(normalize));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRole = normalize(req.user.role);

    if (!allowed.has(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};

export default allowRoles;
