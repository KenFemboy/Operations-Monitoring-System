export const requireSuperAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        message: "Super admin access only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Failed to verify super admin access.",
      error: error.message,
    });
  }
};