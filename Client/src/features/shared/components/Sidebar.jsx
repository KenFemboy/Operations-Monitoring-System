import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { navigationItems } from '../utils/navigation'

function Sidebar({ isOpen, onNavigate }) {
  const location = useLocation()
  const [isBranchesOpen, setIsBranchesOpen] = useState(false)
  const submenuInnerRef = useRef(null)
  const [submenuHeight, setSubmenuHeight] = useState(0)

  const isBranchesRoute = useMemo(
    () => location.pathname.startsWith('/branches'),
    [location.pathname],
  )

  useEffect(() => {
    if (isBranchesRoute) {
      setIsBranchesOpen(true)
    }
  }, [isBranchesRoute])

  useEffect(() => {
    if (!submenuInnerRef.current) {
      return
    }

    const nextHeight = submenuInnerRef.current.scrollHeight
    setSubmenuHeight(nextHeight)
  }, [isBranchesOpen, location.pathname])

  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <h2>Ally's SA</h2>
      <nav className="nav-list">
        {navigationItems.map((item) => {
          if (!item.children) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  isActive ? 'nav-item active' : 'nav-item'
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          }

          return (
            <div key={item.path} className="nav-group">
              <button
                type="button"
                className={`nav-item nav-group-trigger ${isBranchesRoute ? 'active' : ''}`}
                onClick={() => setIsBranchesOpen((current) => !current)}
                aria-expanded={isBranchesOpen}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                <span className={`nav-arrow ${isBranchesOpen ? 'is-open' : ''}`}>⌄</span>
              </button>

              <div
                className={`nav-submenu ${isBranchesOpen ? 'is-open' : ''}`}
                style={{ maxHeight: isBranchesOpen ? `${submenuHeight}px` : '0px' }}
                aria-hidden={!isBranchesOpen}
              >
                <div ref={submenuInnerRef} className="nav-submenu-inner">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        isActive ? 'nav-subitem active' : 'nav-subitem'
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
