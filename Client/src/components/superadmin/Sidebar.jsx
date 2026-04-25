import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/superadmin/dashboard" },
  { label: "Branches", to: "/superadmin/branches" },
  { label: "Employees", to: "/superadmin/employees" },
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
