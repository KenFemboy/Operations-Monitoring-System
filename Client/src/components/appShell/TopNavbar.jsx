import { useState } from 'react'
import Button from '../../features/shared/components/Button'
import Modal from '../../features/shared/components/Modal'

export default function TopNavbar({ title, user, onToggleSidebar, onLogout }) {
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

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
            <p className="sd-navbar-label">Operations Console</p>
            <h2 className="sd-navbar-title">{title}</h2>
          </div>
        </div>

        <div className="sd-navbar-right">
          <p className="sd-user-name">{user?.name || 'User'}</p>
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
