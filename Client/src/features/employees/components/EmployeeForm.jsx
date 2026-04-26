import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'

const defaultForm = {
  firstName: '',
  lastName: '',
  middleName: '',
  birthDate: '',
  gender: '',
  role: '',
  assignedBranchId: '',
  dateHired: '',
  status: 'active',
  address: '',
  contactNumber: '',
  email: '',
  sss: '',
  philhealth: '',
  pagibig: '',
  tin: '',
}

function EmployeeForm({ onClose, onSave, initialData, branchOptions = [], isSaving = false }) {
  const initialState = useMemo(() => {
    if (!initialData) {
      return defaultForm
    }

    return {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      middleName: initialData.middleName || '',
      birthDate: initialData.birthDate ? String(initialData.birthDate).slice(0, 10) : '',
      gender: initialData.gender || '',
      role: initialData.role || '',
      assignedBranchId: initialData.assignedBranchId || '',
      dateHired: initialData.dateHired ? String(initialData.dateHired).slice(0, 10) : '',
      status: initialData.status || 'active',
      address: initialData.address || '',
      contactNumber: initialData.contactNumber || '',
      email: initialData.email || '',
      sss: initialData.governmentIds?.sss || '',
      philhealth: initialData.governmentIds?.philhealth || '',
      pagibig: initialData.governmentIds?.pagibig || '',
      tin: initialData.governmentIds?.tin || '',
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
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      middleName: formData.middleName.trim(),
      birthDate: formData.birthDate || undefined,
      gender: formData.gender || undefined,
      role: formData.role.trim(),
      assignedBranchId: formData.assignedBranchId || undefined,
      dateHired: formData.dateHired || undefined,
      status: formData.status,
      address: formData.address.trim(),
      contactNumber: formData.contactNumber.trim(),
      email: formData.email.trim(),
      governmentIds: {
        sss: formData.sss.trim(),
        philhealth: formData.philhealth.trim(),
        pagibig: formData.pagibig.trim(),
        tin: formData.tin.trim(),
      },
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
          <label htmlFor="middleName">Middle Name</label>
          <input id="middleName" name="middleName" value={formData.middleName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="e.g. Male" />
        </div>
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input id="role" name="role" value={formData.role} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="assignedBranch">Assigned Branch</label>
          <select
            id="assignedBranch"
            name="assignedBranchId"
            value={formData.assignedBranchId}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {branchOptions.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dateHired">Date Hired</label>
          <input id="dateHired" name="dateHired" type="date" value={formData.dateHired} onChange={handleChange} />
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="sss">SSS</label>
          <input id="sss" name="sss" value={formData.sss} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="philhealth">PhilHealth</label>
          <input id="philhealth" name="philhealth" value={formData.philhealth} onChange={handleChange} />
        </div>
      </div>

      <div className="form-grid-two">
        <div className="form-group">
          <label htmlFor="pagibig">Pag-IBIG</label>
          <input id="pagibig" name="pagibig" value={formData.pagibig} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="tin">TIN</label>
          <input id="tin" name="tin" value={formData.tin} onChange={handleChange} />
        </div>
      </div>

      <div className="modal-form-actions">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : initialData ? 'Update Employee' : 'Save Employee'}
        </Button>
      </div>
    </form>
  )
}

export default EmployeeForm
