import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { employeesService } from '../../employees/services/employeesService'
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
  const { branches, loading, error, fetchAll, createBranch, updateBranch } = useBranches()
  const { setActiveBranchSelection } = useBranchContext()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [editFormError, setEditFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)
  const [editFormData, setEditFormData] = useState({ id: '', ...defaultBranchForm })
  const [employeesCountByBranch, setEmployeesCountByBranch] = useState({})
  const [employeesError, setEmployeesError] = useState('')

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
        const rows = await employeesService.getAll()
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

  const handleOpenEditModal = () => {
    if (!branches.length) {
      return
    }

    const firstBranch = branches[0]
    setEditFormData({
      id: firstBranch.id,
      branchName: firstBranch.branchName || '',
      region: firstBranch.region || '',
      provinceCity: firstBranch.provinceCity || '',
      municipality: firstBranch.municipality || '',
      specificLocation: firstBranch.specificLocation || '',
      description: firstBranch.description || '',
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
    setActiveBranchSelection({
      id: branch.id,
      name: branch.branchName || branch.locationRaw,
    })
    navigate('/app/employees')
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
            <Button variant="outline" onClick={handleOpenEditModal} disabled={!branches.length}>
              Edit Branch
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
              <Button variant="outline" onClick={() => handleViewEmployees(row)}>
                View Employees
              </Button>
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
            <label htmlFor="editBranchId">Branch</label>
            <select
              id="editBranchId"
              name="id"
              value={editFormData.id}
              onChange={handleEditFormChange}
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
    </section>
  )
}

export default BranchesPage
