import { useEffect, useState } from 'react'
import api from '../../../api/axios'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'

const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Access' },
  { key: 'branch', label: 'Assigned Branch' },
]

const defaultUserForm = {
  name: '',
  email: '',
  password: '',
  branch: '',
  location: '',
}

const defaultEditUserForm = {
  userId: '',
  name: '',
  email: '',
  password: '',
  branch: '',
  location: '',
}

function BranchUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [formData, setFormData] = useState(defaultUserForm)
  const [editFormData, setEditFormData] = useState(defaultEditUserForm)
  const [pendingFormData, setPendingFormData] = useState(null)
  const [pendingAction, setPendingAction] = useState('create')
  const [authorizationPassword, setAuthorizationPassword] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [branchOptions, setBranchOptions] = useState([])
  const [branchLocationMap, setBranchLocationMap] = useState({})
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const editableUsers = users.filter((user) => user.roleKey !== 'super_admin')

  const buildEditFormFromUser = (user) => {
    const defaultBranch = user?.branch && user.branch !== 'No assigned branch yet' ? user.branch : ''
    const selectedBranch = defaultBranch || branchOptions[0] || ''

    return {
      userId: user?.id || '',
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      branch: selectedBranch,
      location: branchLocationMap[selectedBranch] || '',
    }
  }

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true)
      const response = await api.get('/branches/get-all')
      const branches = response.data?.data || []
      const branchNames = branches.map((branch) => branch.branchName).filter(Boolean)
      const locationMap = branches.reduce((acc, branch) => {
        if (!branch?.branchName) {
          return acc
        }

        acc[branch.branchName] = branch.location || ''
        return acc
      }, {})

      setBranchOptions(branchNames)
      setBranchLocationMap(locationMap)

      if (branchNames.length) {
        setFormData((prev) => ({
          ...prev,
          branch: prev.branch || branchNames[0],
          location: locationMap[prev.branch || branchNames[0]] || '',
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
      setUsers(
        allUsers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          roleKey: user.role,
          role: user.role === 'super_admin' ? 'Full Access' : 'Console Access',
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

    if (name === 'branch') {
      setFormData((prev) => ({
        ...prev,
        branch: value,
        location: branchLocationMap[value] || '',
      }))
      return
    }

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
      location: formData.location,
    })
    setIsModalOpen(false)
    setIsConfirmModalOpen(true)
    setError('')
  }

  const handleEditFormChange = (event) => {
    const { name, value } = event.target

    if (name === 'userId') {
      const selectedUser = editableUsers.find((user) => user.id === value)
      setEditFormData(buildEditFormFromUser(selectedUser))
      return
    }

    if (name === 'branch') {
      setEditFormData((prev) => ({
        ...prev,
        branch: value,
        location: branchLocationMap[value] || '',
      }))
      return
    }

    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditUser = (event) => {
    event.preventDefault()
    setPendingAction('edit')
    setPendingFormData({
      userId: editFormData.userId,
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      password: editFormData.password,
      branch: editFormData.branch,
      location: editFormData.location,
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
        await api.post('/auth/users', {
          ...pendingFormData,
          authorizationPassword,
        })

        setSuccessMessage('User created successfully.')
        setFormData(defaultUserForm)
      } else {
        await api.put(`/auth/users/${pendingFormData.userId}`, {
          ...pendingFormData,
          authorizationPassword,
        })

        setSuccessMessage('User updated successfully.')
        setEditFormData(defaultEditUserForm)
      }

      setAuthorizationPassword('')
      setPendingFormData(null)
      setPendingAction('create')
      setIsConfirmModalOpen(false)
      await fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>User Management</h1>
        <p>Create user accounts and assign branch access.</p>
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
                setEditFormData(buildEditFormFromUser(editableUsers[0]))
                setIsEditModalOpen(true)
              }}
              disabled={!editableUsers.length}
            >
              Edit User
            </Button>
          </div>
        </div>
        {loading ? (
          <p style={{ padding: '1rem' }}>Loading users...</p>
        ) : (
          <Table columns={userColumns} rows={users} />
        )}
      </section>

      <Modal title="Add User" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleFormChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            <label htmlFor="branch">Assigned Branch</label>
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

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={formData.location} readOnly />
          </div>

          <p className="status-neutral">New users can access the main console after login.</p>
          <Button type="submit">Continue</Button>
        </form>
      </Modal>

      <Modal title="Edit User" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleEditUser}>
          <div className="form-group">
            <label htmlFor="editUserId">User</label>
            <select
              id="editUserId"
              name="userId"
              value={editFormData.userId}
              onChange={handleEditFormChange}
              required
            >
              {editableUsers.map((user) => (
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
            <label htmlFor="editEmail">Email</label>
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
            <label htmlFor="editPassword">Password</label>
            <input
              id="editPassword"
              name="password"
              type="password"
              minLength={8}
              value={editFormData.password}
              onChange={handleEditFormChange}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="editBranch">Assigned Branch</label>
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

          <div className="form-group">
            <label htmlFor="editLocation">Location</label>
            <input id="editLocation" name="location" value={editFormData.location} readOnly />
          </div>

          <Button type="submit">Continue</Button>
        </form>
      </Modal>

      <Modal
        title={pendingAction === 'edit' ? 'Confirm User Update' : 'Confirm User Creation'}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <form className="modal-form-scroll" onSubmit={handleConfirmAction}>
          <div className="form-group">
            <label htmlFor="authorizationPassword">Authorization Password</label>
            <input
              id="authorizationPassword"
              name="authorizationPassword"
              type="password"
              value={authorizationPassword}
              onChange={(event) => setAuthorizationPassword(event.target.value)}
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
