import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { branchRows } from '../services/branchesMockService'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'assignedBranch', label: 'Assigned Branch' },
]

const defaultUserForm = {
  name: '',
  role: '',
  assignedBranch: 'Tagum City',
}

const initialUsers = [
  { id: 1, name: 'Andrea Valdez', role: 'Manager', assignedBranch: 'Tagum City' },
  { id: 2, name: 'Marco Lim', role: 'Cashier', assignedBranch: 'Panabo City' },
  { id: 3, name: 'Rina Gomez', role: 'Supervisor', assignedBranch: 'Pantukan' },
]

function BranchUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(defaultUserForm)
  const [users, setUsers] = useState(initialUsers)
  const [branchSelectionByUser, setBranchSelectionByUser] = useState({})

  const branchOptions = useMemo(() => branchRows.map((branch) => branch.name), [])

  const handleFormChange = (event) => {
    const { name, value } = event.target
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
                value={branchSelectionByUser[row.id] ?? row.assignedBranch}
                onChange={(event) => handleAssignSelection(row.id, event.target.value)}
              >
                {branchOptions.map((branchName) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </select>
              <Button variant="outline" onClick={() => handleAssignBranch(row.id)}>
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
            <input id="role" name="role" value={formData.role} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="assignedBranch">Assigned Branch</label>
            <select
              id="assignedBranch"
              name="assignedBranch"
              value={formData.assignedBranch}
              onChange={handleFormChange}
            >
              {branchOptions.map((branchName) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit">Save User</Button>
        </form>
      </Modal>
    </section>
  )
}

export default BranchUsersPage
