import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:8000/api");

const api = axios.create({
  baseURL,
});

const ROLE_PREFIXES = ["/admin", "/superadmin", "/super-admin", "/super_admin"];
const PUBLIC_PREFIXES = ["/auth", "/health", "/public"];

const normalizeRole = (role = "") =>
  role.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");

const getStoredRole = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) return "";

  try {
    return JSON.parse(rawUser)?.role || "";
  } catch {
    return "";
  }
};

const getRolePrefix = () => {
  const role = normalizeRole(getStoredRole());

  if (role === "super_admin" || role === "superadmin") return "/superadmin";
  if (["admin", "console_user", "consoleuser"].includes(role)) return "/admin";

  return "";
};

const shouldApplyRolePrefix = (url = "") => {
  if (!url.startsWith("/") || /^https?:\/\//i.test(url)) return false;

  return ![...ROLE_PREFIXES, ...PUBLIC_PREFIXES].some(
    (prefix) => url === prefix || url.startsWith(`${prefix}/`)
  );
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const rolePrefix = getRolePrefix();

  if (rolePrefix && shouldApplyRolePrefix(config.url)) {
    config.url = `${rolePrefix}${config.url}`;
  }

  return config;
});

export default api;
