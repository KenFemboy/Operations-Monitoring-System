import { useBranchContext } from '../store/branchContext'

function Navbar({ onToggleSidebar }) {
  const {
    branches,
    activeBranch,
    activeBranchMeta,
    isReadOnly,
    setActiveBranch,
  } = useBranchContext()

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

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
          <h1 className="navbar-title">Ally's</h1>
          <p className="navbar-subtitle">Superadmin Command Center</p>
        </div>
      </div>
      <div className="navbar-right">
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
        <p className={`access-indicator ${isReadOnly ? 'readonly' : 'full-access'}`}>
          {isReadOnly ? 'View Only Mode' : 'Full Access'}
        </p>
        <strong>{currentDate}</strong>
      </div>
    </header>
  )
}

export default Navbar
