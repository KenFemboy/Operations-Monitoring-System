import { useEffect, useState } from 'react'
import api from '../../../api/axios'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'branch', label: 'Assigned Branch' },
]

const defaultUserForm = {
  name: '',
  email: '',
  password: '',
  branch: '',
}

const defaultEditUserForm = {
  userId: '',
  name: '',
  email: '',
  branch: '',
}

function BranchUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [formData, setFormData] = useState(defaultUserForm)
  const [editFormData, setEditFormData] = useState(defaultEditUserForm)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [pendingAction, setPendingAction] = useState('create')
  const [superAdminPassword, setSuperAdminPassword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [branchOptions, setBranchOptions] = useState([])
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const adminUsers = users.filter((user) => user.roleKey === 'admin')

  const buildEditFormFromUser = (user) => {
    const defaultBranch = user?.branch && user.branch !== 'No assigned branch yet' ? user.branch : ''

    return {
      userId: user?.id || '',
      name: user?.name || '',
      email: user?.email || '',
      branch: defaultBranch || branchOptions[0] || '',
    }
  }

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true)
      const response = await api.get('/branches/get-all')
      const branches = response.data?.data || []
      const branchNames = branches.map((branch) => branch.branchName).filter(Boolean)

      setBranchOptions(branchNames)

      if (branchNames.length) {
        setFormData((prev) => ({
          ...prev,
          branch: prev.branch || branchNames[0],
        }))
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load branch names')
    } finally {
      setLoadingBranches(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await api.get('/users')
      const allUsers = response.data?.data || []
      const adminAndSuperAdminUsers = allUsers.filter(
        (user) => user.role === 'admin' || user.role === 'super_admin',
      )

      setUsers(
        adminAndSuperAdminUsers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          roleKey: user.role,
          role: user.role === 'super_admin' ? 'Superadmin' : 'Admin',
          branch:
            user.role === 'super_admin'
              ? 'All Branches'
              : user.branch || user.branchId?.branchName || 'No assigned branch yet',
        })),
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchBranches()
  }, [])

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = (event) => {
    event.preventDefault()
    setPendingAction('create')
    setPendingFormData({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      branch: formData.branch,
    })
    setIsModalOpen(false)
    setIsConfirmModalOpen(true)
    setError('')
  }

  const handleEditFormChange = (event) => {
    const { name, value } = event.target

    if (name === 'userId') {
      const selectedUser = adminUsers.find((user) => user.id === value)
      setEditFormData(buildEditFormFromUser(selectedUser))
      return
    }

    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOpenEditUser = (user) => {
    setEditFormData(buildEditFormFromUser(user))
    setError('')
    setSuccessMessage('')
    setIsEditModalOpen(true)
  }

  const handleEditUser = (event) => {
    event.preventDefault()
    setPendingAction('edit')
    setPendingFormData({
      userId: editFormData.userId,
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      branch: editFormData.branch,
    })
    setIsEditModalOpen(false)
    setIsConfirmModalOpen(true)
    setError('')
  }

  const handleConfirmAction = async (event) => {
    event.preventDefault()

    if (!pendingFormData) {
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      if (pendingAction === 'create') {
        await api.post('/auth/admin-users', {
          ...pendingFormData,
          superadminPassword: superAdminPassword,
        })

        setSuccessMessage('Admin user created successfully.')
        setFormData(defaultUserForm)
      } else {
        await api.put(`/auth/admin-users/${pendingFormData.userId}`, {
          ...pendingFormData,
          superadminPassword: superAdminPassword,
        })

        setSuccessMessage('Admin user updated successfully.')
        setEditFormData(defaultEditUserForm)
      }

      setSuperAdminPassword('')
      setPendingFormData(null)
      setPendingAction('create')
      setIsConfirmModalOpen(false)
      await fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admin user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>User Management</h1>
        <p>Create Admin users and assign each account to exactly one branch.</p>
      </header>

      {error ? <p className="status-warning">{error}</p> : null}
      {successMessage ? <p className="status-positive">{successMessage}</p> : null}

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">User List</h3>
          <div className="action-row">
            <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditFormData(buildEditFormFromUser(adminUsers[0]))
                setIsEditModalOpen(true)
              }}
              disabled={!adminUsers.length}
            >
              Edit User
            </Button>
          </div>
        </div>
        {loading ? (
          <p style={{ padding: '1rem' }}>Loading users...</p>
        ) : (
          <Table
            columns={userColumns}
            rows={users}
            renderActions={(row) =>
              row.roleKey === 'admin' ? (
                <Button variant="outline" onClick={() => handleOpenEditUser(row)}>
                  Edit
                </Button>
              ) : (
                <span className="status-neutral">N/A</span>
              )
            }
          />
        )}
      </section>

      <Modal title="Add User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Username / Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              value={formData.password}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch">Assign Branch</label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleFormChange}
              disabled={loadingBranches || !branchOptions.length}
              required
            >
              {branchOptions.map((branchName) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>
          </div>

          <p className="status-neutral">Role will be assigned automatically as Admin.</p>
          <Button type="submit">Continue</Button>
        </form>
      </Modal>

      <Modal title="Edit Admin User" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleEditUser}>
          <div className="form-group">
            <label htmlFor="editUserId">Admin User</label>
            <select
              id="editUserId"
              name="userId"
              value={editFormData.userId}
              onChange={handleEditFormChange}
              required
            >
              {adminUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="editName">Name</label>
            <input id="editName" name="name" value={editFormData.name} onChange={handleEditFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="editEmail">Username / Email</label>
            <input
              id="editEmail"
              name="email"
              type="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="editBranch">Assign Branch</label>
            <select
              id="editBranch"
              name="branch"
              value={editFormData.branch}
              onChange={handleEditFormChange}
              disabled={loadingBranches || !branchOptions.length}
              required
            >
              {branchOptions.map((branchName) => (
                <option key={branchName} value={branchName}>
                  {branchName}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit">Continue</Button>
        </form>
      </Modal>

      <Modal
        title={pendingAction === 'edit' ? 'Confirm Admin Update' : 'Enter Superadmin Password to Confirm'}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <form className="modal-form-scroll" onSubmit={handleConfirmAction}>
          <div className="form-group">
            <label htmlFor="superadminPassword">Superadmin Password</label>
            <input
              id="superadminPassword"
              name="superadminPassword"
              type="password"
              value={superAdminPassword}
              onChange={(event) => setSuperAdminPassword(event.target.value)}
              required
            />
          </div>
          <div className="modal-form-actions">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : pendingAction === 'edit' ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default BranchUsersPage
