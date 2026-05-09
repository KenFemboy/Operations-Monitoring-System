const APP_HOME_ROUTE = "/admin/dashboard";

const getHomeRoute = () => {
	try {
		const raw = localStorage.getItem("user");
		if (!raw) return APP_HOME_ROUTE;
		const user = JSON.parse(raw);
		const role = (user.role || "").toString().toLowerCase().replace(/[_\s]/g, "");

		if (role === "superadmin") {
			return "/superadmin/dashboard";
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
