import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import { branchRows } from '../../branches/services/branchesMockService'

const defaultForm = {
  firstName: '',
  lastName: '',
  role: '',
  assignedBranch: 'Tagum City',
  status: 'Active',
  address: '',
  contactNumber: '',
  email: '',
}

function EmployeeForm({ onClose, onSave, initialData }) {
  const initialState = useMemo(() => {
    if (!initialData) {
      return defaultForm
    }

    return {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      role: initialData.role || '',
      assignedBranch: initialData.assignedBranch || 'Tagum City',
      status: initialData.status || 'Active',
      address: initialData.address || '',
      contactNumber: initialData.contactNumber || '',
      email: initialData.email || '',
    }
  }, [initialData])

  const [formData, setFormData] = useState(initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!onSave) {
      return
    }

    onSave({
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
    })
  }

  return (
    <form className="modal-form-scroll employee-form-grid" onSubmit={handleSubmit}>
      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input id="role" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="assignedBranch">Assigned Branch</label>
          <select
            id="assignedBranch"
            name="assignedBranch"
            value={formData.assignedBranch}
            onChange={handleChange}
          >
            {branchRows.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probationary">Probationary</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number</label>
          <input
            id="contactNumber"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input id="address" name="address" value={formData.address} onChange={handleChange} />
      </div>

      <div className="modal-form-actions">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{initialData ? 'Update Employee' : 'Save Employee'}</Button>
      </div>
    </form>
  )
}

export default EmployeeForm
