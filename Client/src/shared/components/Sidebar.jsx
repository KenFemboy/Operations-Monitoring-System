import { NavLink } from "react-router-dom";
import { adminNavigation } from "../utils/adminNavigation";

export default function Sidebar({ isOpen, onClose, navGroups = adminNavigation }) {

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

              {group.items.map((item) => {
                const to = item.to;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                      `sd-nav-item ${isActive ? "is-active" : ""}`
                    }
                    onClick={onClose}
                  >
                    <span className="sd-nav-item-label">{item.label}</span>
                    <span className="sd-nav-item-hint">{item.hint}</span>
                  </NavLink>
                );
              })}
            </section>
          ))}
        </nav>
      </aside>
    </>
  );
}
