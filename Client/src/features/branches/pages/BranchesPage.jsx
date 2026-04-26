import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import SelectDropdown from '../../shared/components/SelectDropdown'
import Table from '../../shared/components/Table'
import { employeesService } from '../../employees/services/employeesService'
import { plantillaRows } from '../../plantilla/services/plantillaMockService'
import { useBranchContext } from '../../shared/store/branchContext'
import useBranches from '../hooks/useBranches'
import { philippineRegionLocations } from '../services/branchesMockService'

const branchColumns = [
  { key: 'branchName', label: 'Branch Name' },
  { key: 'location', label: 'Location' },
  { key: 'employeesCount', label: 'Employees' },
  { key: 'plantillaRoles', label: 'Plantilla Roles' },
  { key: 'plannedHeadcount', label: 'Planned Headcount' },
  { key: 'address', label: 'Address' },
  { key: 'description', label: 'Description' },
]

const defaultBranchForm = {
  branchName: '',
  region: '',
  area: '',
  location: '',
  address: '',
  description: '',
}

const specificLocationMap = {
  'Davao de Oro': ['Pantukan', 'Nabunturan', 'Montevista', 'Maco'],
  'Davao del Norte': ['Tagum City', 'Panabo City', 'Samal City'],
  'Davao del Sur': ['Digos City', 'Bansalan', 'Hagonoy'],
  'Quezon City': ['Diliman', 'Novaliches', 'Cubao'],
  'Makati City': ['Poblacion', 'Bel-Air', 'San Lorenzo'],
  'Manila City': ['Ermita', 'Malate', 'Binondo'],
}

function BranchesPage() {
  const { branches, loading, error, fetchAll, createBranch } = useBranches()
  const { setActiveBranch } = useBranchContext()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)
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

  const specificLocationOptions = useMemo(() => {
    if (!formData.area) {
      return []
    }

    return specificLocationMap[formData.area] || [formData.area]
  }, [formData.area])

  const tableRows = useMemo(() => {
    const plantillaMetricsByBranch = plantillaRows.reduce((acc, row) => {
      const key = normalizeBranch(row.branch)
      const required = Number(row.requiredCount ?? 1)

      if (!acc[key]) {
        acc[key] = { roles: 0, requiredCount: 0 }
      }

      acc[key].roles += 1
      acc[key].requiredCount += Number.isFinite(required) ? required : 0
      return acc
    }, {})

    return branches.map((branch) => ({
      id: branch.id,
      branchName: branch.branchName,
      location: branch.region ? `${branch.location} (${branch.region})` : branch.location,
      employeesCount:
        employeesCountByBranch[normalizeBranch(branch.branchName)] ??
        employeesCountByBranch[normalizeBranch(branch.location)] ??
        0,
      plantillaRoles:
        plantillaMetricsByBranch[normalizeBranch(branch.branchName)]?.roles ??
        plantillaMetricsByBranch[normalizeBranch(branch.location)]?.roles ??
        0,
      plannedHeadcount:
        plantillaMetricsByBranch[normalizeBranch(branch.branchName)]?.requiredCount ??
        plantillaMetricsByBranch[normalizeBranch(branch.location)]?.requiredCount ??
        0,
      address: branch.address || '-',
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

  const handleOpenBranchWorkforce = (branch) => {
    setActiveBranch(branch.location || branch.branchName)
    navigate('/superadmin/employees')
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'region') {
      setFormData((prev) => ({
        ...prev,
        region: value,
        area: '',
        location: '',
      }))
      return
    }

    if (name === 'area') {
      setFormData((prev) => ({
        ...prev,
        area: value,
        location: '',
      }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    try {
      await createBranch({
        ...formData,
        location: formData.location,
      })

      setFormData(defaultBranchForm)
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Something went wrong while creating branch')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Branches</h1>
        <p>Manage branches with their own employees and plantilla for payroll-ready planning.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Branch List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>
        </div>
        {loading && <p>Loading branches...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {employeesError && <p style={{ color: 'red' }}>{employeesError}</p>}
        {!loading && !error && <Table columns={branchColumns} rows={tableRows} />}
      </section>

      {!loading && !error && tableRows.length ? (
        <section className="table-card" style={{ marginTop: '1rem' }}>
          <div className="table-toolbar">
            <h3 className="table-title">Branch Workforce Setup</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Employees</th>
                  <th>Planned Slots</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((branch) => (
                  <tr key={branch.id}>
                    <td>{branch.branchName}</td>
                    <td>{branch.employeesCount}</td>
                    <td>{branch.plannedHeadcount}</td>
                    <td>
                      <Button variant="outline" onClick={() => handleOpenBranchWorkforce(branch)}>
                        Open Workforce
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

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
          <SelectDropdown
            id="region"
            name="region"
            label="Location"
            value={formData.region}
            onChange={handleChange}
            options={regionOptions}
            placeholder="Select Region"
            required
            enableSearch
            searchPlaceholder="Search region"
          />
          <SelectDropdown
            id="area"
            name="area"
            label="Location (Province/City)"
            value={formData.area}
            onChange={handleChange}
            options={locationOptions}
            placeholder={formData.region ? 'Select Province or City' : 'Select Region first'}
            disabled={!formData.region}
            required
            enableSearch
            searchPlaceholder="Search province/city"
          />
          <SelectDropdown
            id="location"
            name="location"
            label="Specific Location"
            value={formData.location}
            onChange={handleChange}
            options={specificLocationOptions}
            placeholder={formData.area ? 'Select Specific Location' : 'Select Province/City first'}
            disabled={!formData.area}
            required
            enableSearch
            searchPlaceholder="Search specific location"
          />
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
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
    </section>
  )
}




export default BranchesPage
