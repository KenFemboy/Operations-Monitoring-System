import { useState } from 'react'
import Button from '../../shared/components/Button'

function EmployeeForm({ onClose, onCreated }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    address: '',
    contactNumber: '',
    email: '',
    employmentType: 'regular',
    dateHired: '',
    status: 'active',
    basicSalary: '',
    dailyRate: '',
    governmentIds: {
      sss: '',
      philhealth: '',
      pagibig: '',
      tin: '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGovernmentIdChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      governmentIds: {
        ...prev.governmentIds,
        [name]: value,
      },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...formData,
        basicSalary: formData.basicSalary === '' ? undefined : Number(formData.basicSalary),
        dailyRate: formData.dailyRate === '' ? undefined : Number(formData.dailyRate),
      }

      const response = await fetch(`${API_BASE_URL}/api/employees/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to create employee.')
      }

      if (onCreated) {
        await onCreated()
      }
      onClose()
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong while creating employee.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          placeholder="Juan"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          placeholder="Dela Cruz"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="middleName">Middle Name</label>
        <input
          id="middleName"
          name="middleName"
          placeholder="Santos"
          value={formData.middleName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="birthDate">Birth Date</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <input id="gender" name="gender" placeholder="Male" value={formData.gender} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input id="address" name="address" placeholder="City, Province" value={formData.address} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="contactNumber">Contact Number</label>
        <input
          id="contactNumber"
          name="contactNumber"
          placeholder="09XXXXXXXXX"
          value={formData.contactNumber}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="juan@email.com" value={formData.email} onChange={handleChange} />
      </div>
      
      
      <div className="form-group">
        <label htmlFor="employmentType">Employment Type</label>
        <select id="employmentType" name="employmentType" value={formData.employmentType} onChange={handleChange}>
          <option value="regular">Regular</option>
          <option value="contractual">Contractual</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="dateHired">Date Hired</label>
        <input id="dateHired" name="dateHired" type="date" value={formData.dateHired} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="basicSalary">Basic Salary</label>
        <input
          id="basicSalary"
          name="basicSalary"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.basicSalary}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="dailyRate">Daily Rate</label>
        <input
          id="dailyRate"
          name="dailyRate"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.dailyRate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="sss">SSS</label>
        <input id="sss" name="sss" placeholder="SSS number" value={formData.governmentIds.sss} onChange={handleGovernmentIdChange} />
      </div>
      <div className="form-group">
        <label htmlFor="philhealth">PhilHealth</label>
        <input
          id="philhealth"
          name="philhealth"
          placeholder="PhilHealth number"
          value={formData.governmentIds.philhealth}
          onChange={handleGovernmentIdChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="pagibig">Pag-IBIG</label>
        <input
          id="pagibig"
          name="pagibig"
          placeholder="Pag-IBIG number"
          value={formData.governmentIds.pagibig}
          onChange={handleGovernmentIdChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="tin">TIN</label>
        <input id="tin" name="tin" placeholder="TIN number" value={formData.governmentIds.tin} onChange={handleGovernmentIdChange} />
      </div>

      {error ? <p>{error}</p> : null}
      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Employee'}
      </Button>
    </form>
  )
}

export default EmployeeForm
