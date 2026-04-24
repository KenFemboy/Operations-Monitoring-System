import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import SelectDropdown from '../../shared/components/SelectDropdown'
import Table from '../../shared/components/Table'
import { branchRows } from '../services/branchesMockService'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'assignedBranch', label: 'Assigned Branch' },
]

const defaultUserForm = {
  name: '',
  role: 'Admin',
  assignedBranch: 'Tagum Main Branch',
}

const allowedRoles = ['Admin', 'Superadmin (Main Branch)']
const MAIN_BRANCH = 'Tagum Main Branch'

const initialUsers = [
  { id: 1, name: 'Andrea Valdez', role: 'Superadmin (Main Branch)', assignedBranch: 'Tagum Main Branch' },
  { id: 2, name: 'Marco Lim', role: 'Admin', assignedBranch: 'Panabo Branch' },
  { id: 3, name: 'Rina Gomez', role: 'Admin', assignedBranch: 'Quezon City Branch' },
]

function BranchUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(defaultUserForm)
  const [users, setUsers] = useState(initialUsers)
  const [branchSelectionByUser, setBranchSelectionByUser] = useState({})

  const branchOptions = useMemo(
    () => branchRows.map((branch) => branch.branchName || branch.name),
    [],
  )

  const handleFormChange = (event) => {
    const { name, value } = event.target

    if (name === 'role' && value === 'Superadmin (Main Branch)') {
      setFormData((prev) => ({
        ...prev,
        role: value,
        assignedBranch: MAIN_BRANCH,
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = (event) => {
    event.preventDefault()
    const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1

    setUsers((prev) => [
      ...prev,
      {
        id: nextId,
        name: formData.name.trim(),
        role: formData.role.trim(),
        assignedBranch: formData.assignedBranch,
      },
    ])
    setFormData(defaultUserForm)
    setIsModalOpen(false)
  }

  const handleAssignSelection = (userId, branchName) => {
    setBranchSelectionByUser((prev) => ({ ...prev, [userId]: branchName }))
  }

  const handleAssignBranch = (userId) => {
    const selectedUser = users.find((user) => user.id === userId)
    if (selectedUser?.role === 'Superadmin (Main Branch)') {
      return
    }

    const selectedBranch = branchSelectionByUser[userId]
    if (!selectedBranch) {
      return
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              assignedBranch: selectedBranch,
            }
          : user,
      ),
    )
  }

  return (
    <section>
      <header className="page-header">
        <h1>User Management</h1>
        <p>View users, add users, and assign users to a specific branch.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">User List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
        </div>
        <Table
          columns={userColumns}
          rows={users}
          renderActions={(row) => (
            <div className="action-row">
              <select
                className="inline-select"
                disabled={row.role === 'Superadmin (Main Branch)'}
                value={branchSelectionByUser[row.id] ?? row.assignedBranch}
                onChange={(event) => handleAssignSelection(row.id, event.target.value)}
              >
                {branchOptions.map((branchName) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                disabled={row.role === 'Superadmin (Main Branch)'}
                onClick={() => handleAssignBranch(row.id)}
              >
                Assign Branch
              </Button>
            </div>
          )}
        />
      </section>

      <Modal title="Add User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleFormChange} required>
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <SelectDropdown
            id="assignedBranch"
            name="assignedBranch"
            label="Assigned Branch"
            value={formData.assignedBranch}
            onChange={handleFormChange}
            options={branchOptions}
            disabled={formData.role === 'Superadmin (Main Branch)'}
            required
            enableSearch
            searchPlaceholder="Search branch"
          />
          <Button type="submit">Save User</Button>
        </form>
      </Modal>
    </section>
  )
}

export default BranchUsersPage
