import { useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'

const branchColumns = [
  { key: 'branchName', label: 'Branch Name' },
  { key: 'location', label: 'Location' },
  { key: 'address', label: 'Address' },
  { key: 'description', label: 'Description' },
]

const defaultBranchForm = {
  branchName: '',
  location: '',
  address: '',
  description: '',
}

function BranchesPage() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)

  const fetchBranches = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`${API_BASE_URL}/api/branches/get-all`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to load branches')
      }

      const mappedBranches = (result?.data || []).map((branch) => ({
        id: branch._id,
        branchName: branch.branchName || 'N/A',
        location: branch.location || 'N/A',
        address: branch.address || '-',
        description: branch.description || '-',
      }))

      setBranches(mappedBranches)
    } catch (err) {
      setError(err.message || 'Something went wrong while loading branches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/branches/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to create branch')
      }

      setFormData(defaultBranchForm)
      setIsModalOpen(false)
      await fetchBranches()
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
        {!loading && !error && <Table columns={branchColumns} rows={branches} />}
      </section>

      <Modal title="Add Branch" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
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
