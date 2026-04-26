const normalizeRole = (role) =>
  typeof role === "string" ? role.trim().toLowerCase() : "";

const isSuperadminRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === "super_admin" || normalizedRole === "superadmin";
};

const isAdminRole = (role) => normalizeRole(role) === "admin";

const getHomeRouteByRole = (user) => {
  if (isSuperadminRole(user?.role)) return "/superadmin/dashboard";
  if (isAdminRole(user?.role)) return "/admin-dashboard";
  return "/login";
};

export { getHomeRouteByRole, isAdminRole, isSuperadminRole };