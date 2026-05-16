import { useState } from 'react'
import Button from './Button'
import Modal from './Modal'

const superAdminRoles = ['super_admin', 'superadmin']

const getUserDisplayName = (user) => {
  const rawName = user?.name || user?.email || 'User'
  if (rawName.trim().toLowerCase() === 'ally super admin') {
    return "Ally's Super Admin"
  }
  return rawName
}

const getInitials = (name) => {
  if (name.trim().toLowerCase() === "ally's super admin") {
    return ''
  }

  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'U'
  )
}

const getBranchDisplayName = (user) => {
  const populatedBranch = typeof user?.branchId === 'object' ? user.branchId : null
  const branchName =
    user?.branchName ||
    user?.branch ||
    populatedBranch?.branchName ||
    populatedBranch?.name

  if (branchName) {
    return branchName
  }

  return superAdminRoles.includes(user?.role) ? 'All branches' : 'No branch assigned'
}

export default function TopNavbar({ title, user, onToggleSidebar, onLogout }) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const userDisplayName = getUserDisplayName(user)
  const branchDisplayName = getBranchDisplayName(user)

  const handleConfirmLogout = () => {
    setIsLogoutConfirmOpen(false)
    onLogout()
  }

  return (
    <>
      <header className="sd-navbar">
        <div className="sd-navbar-left">
          <button
            type="button"
            className="sd-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            Menu
          </button>

          <div>
            <h2 className="sd-navbar-title">{title}</h2>
          </div>
        </div>

        <div className="sd-navbar-right">
          <div className="sd-user-summary" aria-label="Logged in user and branch">
            {getInitials(userDisplayName) ? (
              <span className="sd-user-avatar" aria-hidden="true">
                {getInitials(userDisplayName)}
              </span>
            ) : null}
            <span className="sd-user-details">
              <span className="sd-user-label">Logged in as</span>
              <span className="sd-user-name">{userDisplayName}</span>
            </span>
            <span className="sd-branch-badge">
              <span className="sd-branch-label">Branch</span>
              <span className="sd-branch-name">{branchDisplayName}</span>
            </span>
          </div>
          <button
            type="button"
            className="sd-logout-btn"
            onClick={() => setIsLogoutConfirmOpen(true)}
          >
            Logout
          </button>
        </div>
      </header>

      <Modal
        title="Confirm Logout"
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
      >
        <form
          className="modal-form-scroll"
          onSubmit={(event) => {
            event.preventDefault()
            handleConfirmLogout()
          }}
        >
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            Are you sure you want to logout? You will need to log in again to access the console.
          </p>

          <div className="modal-form-actions">
            <Button type="submit" variant="danger">
              Logout
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
