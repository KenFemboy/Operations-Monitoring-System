import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/superadmin/dashboard" },
  { label: "Branches", to: "/superadmin/branches" },
  { label: "Branch Users", to: "/superadmin/branches/users" },
  { label: "Employees", to: "/superadmin/employees" },
  { label: "Inventory", to: "/superadmin/inventory" },
  { label: "Sales", to: "/superadmin/sales" },
  { label: "Attendance", to: "/superadmin/attendance" },
  { label: "Feedback", to: "/superadmin/feedback" },
  { label: "Incidents", to: "/superadmin/incidents" },
  { label: "NTE", to: "/superadmin/nte" },
  { label: "Plantilla", to: "/superadmin/plantilla" },
  { label: "Contributions", to: "/superadmin/contributions" },
  { label: "Leaves", to: "/superadmin/leaves" },
  { label: "Reports", to: "/superadmin/reports" },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <button
        type="button"
        className={`sd-backdrop ${isOpen ? "is-visible" : ""}`}
        onClick={onClose}
        aria-label="Close sidebar"
      />

      <aside className={`sd-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="sd-brand-wrap">
          <p className="sd-brand-eyebrow">Operations Monitoring</p>
          <h1 className="sd-brand-title">Superadmin</h1>
        </div>

        <nav className="sd-nav" aria-label="Superadmin navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sd-nav-item ${isActive ? "is-active" : ""}`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
