import { useEffect, useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import SelectDropdown from '../../shared/components/SelectDropdown'
import Table from '../../shared/components/Table'
import useBranches from '../hooks/useBranches'
import { philippineRegionLocations } from '../services/branchesMockService'

const branchColumns = [
  { key: 'branchName', label: 'Branch Name' },
  { key: 'location', label: 'Location' },
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)

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
    return branches.map((branch) => ({
      id: branch.id,
      branchName: branch.branchName,
      location: branch.region ? `${branch.location} (${branch.region})` : branch.location,
      address: branch.address || '-',
      description: branch.description || '-',
    }))
  }, [branches])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

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
        <p>Manage all branches.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Branch List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>
        </div>
        {loading && <p>Loading branches...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && <Table columns={branchColumns} rows={tableRows} />}
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
