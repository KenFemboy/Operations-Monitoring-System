import { useState } from 'react'
import Button from '../../shared/components/Button'

function EmployeeForm({ onClose, onCreated }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    assignedBranch: '',
    status: 'active',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        <label htmlFor="role">Role</label>
        <input
          id="role"
          name="role"
          placeholder="Supervisor"
          value={formData.role}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="assignedBranch">Assigned Branch</label>
        <input
          id="assignedBranch"
          name="assignedBranch"
          placeholder="Manila"
          value={formData.assignedBranch}
          onChange={handleChange}
          required
        />
      </div>
      
      {error ? <p>{error}</p> : null}
      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Employee'}
      </Button>
    </form>
  )
}

export default EmployeeForm
