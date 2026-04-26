import { NavLink } from "react-router-dom";

const navGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        hint: "Branch performance snapshot",
        to: "/superadmin/dashboard",
      },
      {
        label: "Reports",
        hint: "Summaries and exports",
        to: "/superadmin/reports",
      },
    ],
  },
  {
    title: "Workforce",
    items: [
      {
        label: "Branches",
        hint: "Locations and setup",
        to: "/superadmin/branches",
      },
      {
        label: "Branch Users",
        hint: "Admin account assignment",
        to: "/superadmin/branches/users",
      },
      {
        label: "Employees",
        hint: "Per-branch employee records",
        to: "/superadmin/employees",
      },
      {
        label: "Plantilla",
        hint: "Role slots and salary basis",
        to: "/superadmin/plantilla",
      },
      {
        label: "Attendance",
        hint: "Daily time records",
        to: "/superadmin/attendance",
      },
      {
        label: "Leaves",
        hint: "Leave filing and status",
        to: "/superadmin/leaves",
      },
      {
        label: "Contributions",
        hint: "Government deductions",
        to: "/superadmin/contributions",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Inventory",
        hint: "Stocks and items",
        to: "/superadmin/inventory",
      },
      {
        label: "Sales",
        hint: "Revenue and transactions",
        to: "/superadmin/sales",
      },
      {
        label: "Feedback",
        hint: "Customer ratings",
        to: "/superadmin/feedback",
      },
      {
        label: "Incidents",
        hint: "Issue monitoring",
        to: "/superadmin/incidents",
      },
      {
        label: "NTE",
        hint: "Notice to explain tracking",
        to: "/superadmin/nte",
      },
    ],
  },
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
          {navGroups.map((group) => (
            <section className="sd-nav-group" key={group.title}>
              <p className="sd-nav-group-title">{group.title}</p>

              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `sd-nav-item ${isActive ? "is-active" : ""}`
                  }
                  onClick={onClose}
                >
                  <span className="sd-nav-item-label">{item.label}</span>
                  <span className="sd-nav-item-hint">{item.hint}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
      </aside>
    </>
  );
}
