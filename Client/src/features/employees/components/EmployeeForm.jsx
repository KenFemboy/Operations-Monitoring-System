import { useEffect, useMemo, useState } from 'react'
import Button from '../../shared/components/Button'

function EmployeeForm({ onClose, onCreated, initialData, employeeId }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const isEditMode = !!employeeId
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    middleName: initialData?.middleName || '',
    birthDate: initialData?.birthDate || '',
    gender: initialData?.gender || '',
    address: initialData?.address || '',
    contactNumber: initialData?.contactNumber || '',
    email: initialData?.email || '',
    departmentId: initialData?.departmentId?._id || '',
    positionId: initialData?.positionId?._id || '',
    employmentType: initialData?.employmentType || 'regular',
    dateHired: initialData?.dateHired || '',
    status: initialData?.status || 'active',
    basicSalary: initialData?.basicSalary || '',
    dailyRate: initialData?.dailyRate || '',
    governmentIds: {
      sss: initialData?.governmentIds?.sss || '',
      philhealth: initialData?.governmentIds?.philhealth || '',
      pagibig: initialData?.governmentIds?.pagibig || '',
      tin: initialData?.governmentIds?.tin || '',
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOptionsLoading, setIsOptionsLoading] = useState(true)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])

  const filteredPositions = useMemo(() => {
    if (!formData.departmentId) {
      return []
    }

    return positions.filter((position) => position.departmentId?._id === formData.departmentId)
  }, [formData.departmentId, positions])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsOptionsLoading(true)
        setError('')

        const [departmentResponse, positionResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/departments/get-all`),
          fetch(`${API_BASE_URL}/api/positions/get-all`),
        ])

        const [departmentResult, positionResult] = await Promise.all([
          departmentResponse.json(),
          positionResponse.json(),
        ])

        if (!departmentResponse.ok) {
          throw new Error(departmentResult?.message || 'Failed to load departments.')
        }

        if (!positionResponse.ok) {
          throw new Error(positionResult?.message || 'Failed to load positions.')
        }

        setDepartments(departmentResult?.data || [])
        setPositions(positionResult?.data || [])
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to load department/position options.')
      } finally {
        setIsOptionsLoading(false)
      }
    }

    fetchOptions()
  }, [API_BASE_URL])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => {
      if (name === 'departmentId') {
        return { ...prev, departmentId: value, positionId: '' }
      }

      return { ...prev, [name]: value }
    })
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

      const endpoint = isEditMode ? `${API_BASE_URL}/api/employees/update/${employeeId}` : `${API_BASE_URL}/api/employees/create`
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || `Failed to ${isEditMode ? 'update' : 'create'} employee.`)
      }

      if (onCreated) {
        await onCreated()
      }
      onClose()
      window.location.reload()
    } catch (submitError) {
      setError(submitError.message || `Something went wrong while ${isEditMode ? 'updating' : 'creating'} employee.`)
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
        <label htmlFor="departmentId">Department</label>
        <select
          id="departmentId"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
          disabled={isOptionsLoading}
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="positionId">Position</label>
        <select
          id="positionId"
          name="positionId"
          value={formData.positionId}
          onChange={handleChange}
          required
          disabled={isOptionsLoading || !formData.departmentId}
        >
          <option value="">
            {formData.departmentId ? 'Select Position' : 'Select Department First'}
          </option>
          {filteredPositions.map((position) => (
            <option key={position._id} value={position._id}>
              {position.name}
            </option>
          ))}
        </select>
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
        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Employee' : 'Save Employee'}
      </Button>
    </form>
  )
}

export default EmployeeForm
