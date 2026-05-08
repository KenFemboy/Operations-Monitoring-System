const APP_HOME_ROUTE = "/app/dashboard";

const getHomeRoute = () => {
	try {
		const raw = localStorage.getItem("user");
		if (!raw) return APP_HOME_ROUTE;
		const user = JSON.parse(raw);
		const role = (user.role || "").toString().toLowerCase().replace(/[_\s]/g, "");

		if (role === "superadmin") {
			return "/super_admin/dashboard";
		}

		if (["admin", "consoleuser", "hr"].includes(role)) {
			return "/admin/dashboard";
		}

		return APP_HOME_ROUTE;
	} catch {
		return APP_HOME_ROUTE;
	}
};

export { APP_HOME_ROUTE, getHomeRoute };
