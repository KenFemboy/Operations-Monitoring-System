export const normalizeRole = (role = "") => {
  const normalized = role.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");

  if (normalized === "super_admin" || normalized === "superadmin") {
    return "superadmin";
  }

  if (normalized === "consoleuser" || normalized === "console_user") {
    return "console_user";
  }

  if (normalized === "admin") {
    return "admin";
  }

  return normalized;
};

export const isSuperAdminRole = (role) => normalizeRole(role) === "superadmin";

export const isBranchScopedRole = (role) =>
  ["admin", "console_user"].includes(normalizeRole(role));

