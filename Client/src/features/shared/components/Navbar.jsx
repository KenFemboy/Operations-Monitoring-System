import { useContext, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useBranchContext } from '../store/branchContext'

function Navbar({ onToggleSidebar, isAdmin = false }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { logout, user } = useContext(AuthContext)
  const {
    branches,
    activeBranch,
    displayBranchName,
    activeBranchMeta,
    isReadOnly,
    setActiveBranch,
  } = useBranchContext()

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    logout()
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setShowLogoutConfirm(false)
    }
  }

  return (
    <>
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
            <h1 className="navbar-title">Ally's</h1>
            <p className="navbar-subtitle">
              {isAdmin ? 'Admin Operations Interface' : "Ally's Management System"}
            </p>
          </div>
        </div>
        <div className="navbar-right">
          {isAdmin ? (
            <p className="branch-switcher">
              <span>Branch: {displayBranchName || activeBranch}</span>
            </p>
          ) : (
            <label className="branch-switcher" htmlFor="activeBranch">
              <span>
                Branch: {activeBranch}
                {activeBranchMeta.type === 'Main Branch' ? ` (${activeBranchMeta.type})` : ''}
              </span>
              <select
                id="activeBranch"
                value={activeBranch}
                onChange={(event) => setActiveBranch(event.target.value)}
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.name}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <p className={`access-indicator ${isReadOnly ? 'readonly' : 'full-access'}`}>
            {isAdmin ? 'Role: Admin' : isReadOnly ? 'View Only Mode' : 'Full Access'}
          </p>
          <div className="navbar-actions">
            <strong>{currentDate}</strong>
            <button
              type="button"
              className="navbar-logout"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {showLogoutConfirm ? (
        <div
          className="logout-confirm-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <div className="logout-confirm-card">
            <h3>Confirm Logout</h3>
            <p>
              Sign out {user?.name ? `as ${user.name}` : 'from this account'}?
            </p>
            <div className="logout-confirm-actions">
              <button
                type="button"
                className="logout-cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-confirm-btn"
                onClick={handleConfirmLogout}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Navbar
