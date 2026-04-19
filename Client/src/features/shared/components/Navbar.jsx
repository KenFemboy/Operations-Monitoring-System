import { useLocation } from 'react-router-dom'
import { navigationItems } from '../utils/navigation'

function Navbar({ onToggleSidebar }) {
  const location = useLocation()

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const activeItem = navigationItems.find(
    (item) => item.path === location.pathname,
  )

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          Menu
        </button>
        <div>
          <h1 className="navbar-title">Ally's Restaurant Management System</h1>
          <p className="navbar-subtitle">Frontend-only prototype with mock restaurant operations</p>
        </div>
      </div>
      <div className="navbar-right">
        <p className="navbar-breadcrumb">Section: {activeItem?.label ?? 'Dashboard'}</p>
        <strong>{currentDate}</strong>
      </div>
    </header>
  )
}

export default Navbar
