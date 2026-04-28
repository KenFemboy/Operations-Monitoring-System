import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../auth/context/AuthContext'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { getEmployees } from '../../../employees/api/employeeApi'
import { useBranchContext } from '../../shared/store/branchContext'
import useBranches from '../hooks/useBranches'
import { philippineRegionLocations } from '../services/branchesMockService'

const branchColumns = [
  { key: 'branchName', label: 'Branch Name' },
  { key: 'region', label: 'Region' },
  { key: 'provinceCity', label: 'Province/City' },
  { key: 'municipality', label: 'Municipality' },
  { key: 'specificLocation', label: 'Specific Location' },
  { key: 'location', label: 'Location' },
  { key: 'employeesCount', label: 'Employees' },
  { key: 'description', label: 'Description' },
]

const defaultBranchForm = {
  branchName: '',
  region: '',
  provinceCity: '',
  municipality: '',
  specificLocation: '',
  description: '',
}

function BranchesPage() {
  const { branches, loading, error, fetchAll, createBranch, updateBranch, deleteBranch } = useBranches()
  const { setActiveBranchSelection } = useBranchContext()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [editFormError, setEditFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)
  const [editFormData, setEditFormData] = useState({ id: '', ...defaultBranchForm })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteBranchId, setDeleteBranchId] = useState('')
  const [deleteAuthorizationPassword, setDeleteAuthorizationPassword] = useState('')
  const [deleteFormError, setDeleteFormError] = useState('')
  const [employeesCountByBranch, setEmployeesCountByBranch] = useState({})
  const [employeesError, setEmployeesError] = useState('')
  const [isBranchAccessModalOpen, setIsBranchAccessModalOpen] = useState(false)
  const [branchAccessPassword, setBranchAccessPassword] = useState('')
  const [pendingBranchAccess, setPendingBranchAccess] = useState(null)

  const normalizeBranch = (value = '') =>
    value
      .toLowerCase()
      .replace(/\bmain\b/g, '')
      .replace(/\bbranch\b/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const regionOptions = useMemo(() => Object.keys(philippineRegionLocations), [])

  const locationOptions = useMemo(() => {
    if (!formData.region) {
      return []
    }

    return philippineRegionLocations[formData.region] || []
  }, [formData.region])

  const editLocationOptions = useMemo(() => {
    if (!editFormData.region) {
      return []
    }

    return philippineRegionLocations[editFormData.region] || []
  }, [editFormData.region])

  const tableRows = useMemo(() => {
    return branches.map((branch) => ({
      id: branch.id,
      branchName: branch.branchName,
      locationRaw: branch.location,
      region: branch.region || '-',
      provinceCity: branch.provinceCity || '-',
      municipality: branch.municipality || '-',
      specificLocation: branch.specificLocation || '-',
      location: branch.location || '-',
      employeesCount:
        employeesCountByBranch[normalizeBranch(branch.branchName)] ??
        employeesCountByBranch[normalizeBranch(branch.location)] ??
        0,
      description: branch.description || '-',
    }))
  }, [branches, employeesCountByBranch])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const loadEmployeesByBranch = async () => {
      try {
        setEmployeesError('')
        const response = await getEmployees()
        const rows = response?.data?.data || []
        const counts = rows.reduce((acc, employee) => {
          const branchName =
            employee.assignedBranchId?.branchName || employee.assignedBranch || employee.branch || ''

          const key = normalizeBranch(branchName)
          if (!key) {
            return acc
          }

          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {})

        setEmployeesCountByBranch(counts)
      } catch (err) {
        setEmployeesError(err.message || 'Unable to load employee counts')
      }
    }

    loadEmployeesByBranch()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'region') {
      setFormData((prev) => ({
        ...prev,
        region: value,
        provinceCity: '',
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditFormChange = (event) => {
    const { name, value } = event.target

    if (name === 'id') {
      const selectedBranch = branches.find((branch) => branch.id === value)

      if (!selectedBranch) {
        return
      }

      setEditFormData({
        id: selectedBranch.id,
        branchName: selectedBranch.branchName || '',
        region: selectedBranch.region || '',
        provinceCity: selectedBranch.provinceCity || '',
        municipality: selectedBranch.municipality || '',
        specificLocation: selectedBranch.specificLocation || '',
        description: selectedBranch.description || '',
      })
      return
    }

    if (name === 'region') {
      setEditFormData((prev) => ({
        ...prev,
        region: value,
        provinceCity: '',
      }))
      return
    }

    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    try {
      await createBranch({
        ...formData,
        provinceCity: formData.provinceCity.trim(),
        municipality: formData.municipality.trim(),
        specificLocation: formData.specificLocation.trim(),
      })

      setFormData(defaultBranchForm)
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Something went wrong while creating branch')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenEditModal = (row) => {
    const selectedBranch = branches.find((branch) => branch.id === row.id)

    if (!selectedBranch) {
      return
    }

    setEditFormData({
      id: selectedBranch.id,
      branchName: selectedBranch.branchName || '',
      region: selectedBranch.region || '',
      provinceCity: selectedBranch.provinceCity || '',
      municipality: selectedBranch.municipality || '',
      specificLocation: selectedBranch.specificLocation || '',
      description: selectedBranch.description || '',
    })
    setEditFormError('')
    setIsEditModalOpen(true)
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    setIsEditSubmitting(true)
    setEditFormError('')

    try {
      await updateBranch(editFormData.id, {
        ...editFormData,
        provinceCity: editFormData.provinceCity.trim(),
        municipality: editFormData.municipality.trim(),
        specificLocation: editFormData.specificLocation.trim(),
      })
      setIsEditModalOpen(false)
    } catch (err) {
      setEditFormError(err.message || 'Something went wrong while updating branch')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const handleViewEmployees = (branch) => {
    // If user is not super admin and trying to access a branch, require password confirmation
    if (user?.role !== 'super_admin' && user?.branch && user.branch !== 'All Branches') {
      setPendingBranchAccess(branch)
      setIsBranchAccessModalOpen(true)
      return
    }

    setActiveBranchSelection({
      id: branch.id,
      name: branch.branchName || branch.locationRaw,
    })
    navigate('/app/employees')
  }

  const handleConfirmBranchAccess = (event) => {
    event.preventDefault()

    if (!pendingBranchAccess || !branchAccessPassword) {
      return
    }

    // Note: Password validation would be done via backend auth in production
    // For now, just confirm with the provided password
    if (branchAccessPassword.length >= 8) {
      setActiveBranchSelection({
        id: pendingBranchAccess.id,
        name: pendingBranchAccess.branchName || pendingBranchAccess.locationRaw,
      })
      setBranchAccessPassword('')
      setIsBranchAccessModalOpen(false)
      setPendingBranchAccess(null)
      navigate('/app/employees')
    }
  }

  const handleDeleteSubmit = async (event) => {
    event.preventDefault()
    setDeleteFormError('')

    if (!deleteBranchId) {
      setDeleteFormError('Please select a branch to delete.')
      return
    }

    try {
      setIsDeleteSubmitting(true)
      await deleteBranch(deleteBranchId, deleteAuthorizationPassword)
      setDeleteAuthorizationPassword('')
      setDeleteFormError('')
      setIsDeleteModalOpen(false)
    } catch (err) {
      setDeleteFormError(err.message || 'Something went wrong while deleting branch')
    } finally {
      setIsDeleteSubmitting(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Branches</h1>
        <p>Manage branches and monitor employee count per location.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Branch List</h3>
          <div className="action-row">
            <Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteBranchId(branches[0]?.id || '')
                setDeleteAuthorizationPassword('')
                setDeleteFormError('')
                setIsDeleteModalOpen(true)
              }}
              disabled={!branches.length}
            >
              Delete Branch
            </Button>
          </div>
        </div>
        {loading && <p>Loading branches...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {employeesError && <p style={{ color: 'red' }}>{employeesError}</p>}
        {!loading && !error && (
          <Table
            columns={branchColumns}
            rows={tableRows}
            renderActions={(row) => (
              <div className="action-row">
                <Button variant="outline" onClick={() => handleViewEmployees(row)}>
                  View Employees
                </Button>
                <Button variant="outline" onClick={() => handleOpenEditModal(row)}>
                  Edit
                </Button>
              </div>
            )}
          />
        )}
      </section>

      <Modal title="Add Branch" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="branchName">Branch Name</label>
            <input
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select id="region" name="region" value={formData.region} onChange={handleChange} required>
              <option value="">Select Region</option>
              {regionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="provinceCity">Province/City</label>
            <input
              id="provinceCity"
              name="provinceCity"
              list="province-city-options"
              value={formData.provinceCity}
              onChange={handleChange}
              placeholder={formData.region ? 'Search or type Province/City' : 'Select Region first'}
              disabled={!formData.region}
              required
            />
            <datalist id="province-city-options">
              {locationOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="municipality">Municipality</label>
            <input
              id="municipality"
              name="municipality"
              value={formData.municipality}
              onChange={handleChange}
              placeholder="Enter municipality"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specificLocation">Specific Location</label>
            <input
              id="specificLocation"
              name="specificLocation"
              value={formData.specificLocation}
              onChange={handleChange}
              placeholder="Street / barangay / landmark"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Branch'}
          </Button>
        </form>
      </Modal>

      <Modal title="Edit Branch" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <form className="modal-form-scroll" onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label htmlFor="editBranchName">Branch Name</label>
            <input
              id="editBranchName"
              name="branchName"
              value={editFormData.branchName}
              onChange={handleEditFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editRegion">Region</label>
            <select
              id="editRegion"
              name="region"
              value={editFormData.region}
              onChange={handleEditFormChange}
              required
            >
              <option value="">Select Region</option>
              {regionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editProvinceCity">Province/City</label>
            <input
              id="editProvinceCity"
              name="provinceCity"
              list="edit-province-city-options"
              value={editFormData.provinceCity}
              onChange={handleEditFormChange}
              placeholder={editFormData.region ? 'Search or type Province/City' : 'Select Region first'}
              disabled={!editFormData.region}
              required
            />
            <datalist id="edit-province-city-options">
              {editLocationOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="editMunicipality">Municipality</label>
            <input
              id="editMunicipality"
              name="municipality"
              value={editFormData.municipality}
              onChange={handleEditFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editSpecificLocation">Specific Location</label>
            <input
              id="editSpecificLocation"
              name="specificLocation"
              value={editFormData.specificLocation}
              onChange={handleEditFormChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">Description</label>
            <input
              id="editDescription"
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              required
            />
          </div>

          {editFormError && <p style={{ color: 'red' }}>{editFormError}</p>}
          <Button type="submit" disabled={isEditSubmitting}>
            {isEditSubmitting ? 'Saving...' : 'Update Branch'}
          </Button>
        </form>
      </Modal>

      <Modal
        title="Delete Branch"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <form className="modal-form-scroll" onSubmit={handleDeleteSubmit}>
          <div className="form-group">
            <label htmlFor="deleteBranchId">Branch</label>
            <select
              id="deleteBranchId"
              name="deleteBranchId"
              value={deleteBranchId}
              onChange={(event) => setDeleteBranchId(event.target.value)}
              required
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="deleteAuthorizationPassword">Admin Password</label>
            <input
              id="deleteAuthorizationPassword"
              name="deleteAuthorizationPassword"
              type="password"
              value={deleteAuthorizationPassword}
              onChange={(event) => setDeleteAuthorizationPassword(event.target.value)}
              required
            />
          </div>

          {deleteFormError && <p style={{ color: 'red' }}>{deleteFormError}</p>}
          <div className="modal-form-actions">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={isDeleteSubmitting}>
              {isDeleteSubmitting ? 'Deleting...' : 'Delete Branch'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        title="Verify Branch Access"
        isOpen={isBranchAccessModalOpen}
        onClose={() => {
          setIsBranchAccessModalOpen(false)
          setBranchAccessPassword('')
          setPendingBranchAccess(null)
        }}
      >
        <form className="modal-form-scroll" onSubmit={handleConfirmBranchAccess}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            To access {pendingBranchAccess?.branchName}, please enter your password for security verification.
          </p>

          <div className="form-group">
            <label htmlFor="branchAccessPassword">Your Password</label>
            <input
              id="branchAccessPassword"
              type="password"
              minLength={8}
              value={branchAccessPassword}
              onChange={(event) => setBranchAccessPassword(event.target.value)}
              required
            />
          </div>

          <div className="modal-form-actions">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsBranchAccessModalOpen(false)
                setBranchAccessPassword('')
                setPendingBranchAccess(null)
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Verify & Access</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default BranchesPage
