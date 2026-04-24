import { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { branchRows } from '../services/branchesMockService'

const branchColumns = [
  { key: 'branchName', label: 'Branch Name' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
]

const defaultBranchForm = {
  branchName: '',
  location: '',
  address: '',
  description: '',
  status: 'Operational',
}

function BranchesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(defaultBranchForm)
  const [branches, setBranches] = useState(() =>
    branchRows.map((branch) => ({
      id: branch.id,
      branchName: branch.name,
      location: branch.location,
      address: `${branch.location} - Main Road`,
      description: `${branch.type} operations`,
      status: branch.status,
    })),
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextId = branches.length ? Math.max(...branches.map((branch) => branch.id)) + 1 : 1

    setBranches((prev) => [
      ...prev,
      {
        id: nextId,
        branchName: formData.branchName.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        status: formData.status,
      },
    ])
    setFormData(defaultBranchForm)
    setIsModalOpen(false)
  }

  return (
    <section>
      <header className="page-header">
        <h1>Branches</h1>
        <p>API/BRANCHES/CREATE and API/BRANCHES/GET ALL (mock UI only)</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Branch List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Branch</Button>
        </div>
        <Table columns={branchColumns} rows={branches} />
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
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <Button type="submit">Save Branch</Button>
        </form>
      </Modal>
    </section>
  )
}

export default BranchesPage
