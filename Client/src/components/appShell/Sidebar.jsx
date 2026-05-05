import { NavLink } from "react-router-dom";

const navGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        hint: "Performance snapshot",
        to: "/app/dashboard",
      },
      {
        label: "Reports",
        hint: "Summaries and exports",
        to: "/app/reports",
      },
      {
        label: "Admin Users",
        hint: "Manage branch admins",
        to: "/app/admin-users",
      },
    ],
  },
  {
    title: "Branch Management",
    items: [
      {
        label: "Branches",
        hint: "Locations and setup",
        to: "/app/branches",
      },
      
    ],
  },
  {
    title: "HR",
    items: [
      {
        label: "Employees",
        hint: "Employee records",
        to: "/app/employees",
      },
      
      {
        label: "Attendance",
        hint: "Daily time records",
        to: "/app/attendance",
      },
      {
        label: "Payroll",
        hint: 'Salary and compensation',
        to: '/app/payroll',
      },
      {
        label: "Leaves",
        hint: "Leave applications",
        to: "/app/leave",
      },
      {
        label: "Contributions",
        hint: "Government remittances",
        to: "/app/contributions",
      },
      {
        label: "Incident Reports",
        hint: "Incident documentation",
        to: "/app/incident-reports",
      },
      {
        label: "Notice to Explain",
        hint: "Disciplinary notices",
        to: "/app/nte",
      },
      
      {
        label: "Plantilla",
        hint: "Role slots and salary basis",
        to: "/app/plantilla",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Inventory",
        hint: "Stocks and items",
        to: "/app/inventory",
      },
      {
        label: "Sales",
        hint: "Revenue and transactions",
        to: "/app/sales",
      },
      {
        label: "Feedback",
        hint: "Customer ratings",
        to: "/app/feedback",
      },
    ],
  },

  
  {
    title: "System",
    items: [
      {
        label: "Settings",
        hint: "System preferences",
        to: "/app/settings",
      },
      {
        label: "Archive",
        hint: "Deleted records",
        to: "/app/settings/archive",
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
          <h1 className="sd-brand-title">Console</h1>
        </div>

        <nav className="sd-nav" aria-label="Main navigation">
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
