import { useCallback, useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { positionColumns } from '../utils/positionColumns'

const initialFormState = {
  name: '',
  departmentId: '',
  baseSalary: '',
  dailyRate: '',
  level: 1,
  status: 'active',
}

function PositionsPage() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState(initialFormState)

  const fetchDepartments = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/departments/get-all`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.message || 'Failed to load departments.')
    }

    setDepartments(result?.data || [])
  }, [API_BASE_URL])

  const fetchPositions = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/positions/get-all`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.message || 'Failed to load positions.')
    }

    const mappedPositions = (result?.data || []).map((position) => ({
      id: position._id,
      name: position.name || 'N/A',
      department: position.departmentId?.name || 'N/A',
      baseSalary: position.baseSalary ?? 0,
      dailyRate: position.dailyRate ?? 0,
      level: position.level ?? 1,
      status: position.status || 'N/A',
    }))

    setPositions(mappedPositions)
  }, [API_BASE_URL])

  const loadPageData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      await Promise.all([fetchDepartments(), fetchPositions()])
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while loading positions.')
    } finally {
      setIsLoading(false)
    }
  }, [fetchDepartments, fetchPositions])

  useEffect(() => {
    loadPageData()
  }, [loadPageData])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    try {
      const payload = {
        ...formData,
        baseSalary: formData.baseSalary === '' ? undefined : Number(formData.baseSalary),
        dailyRate: formData.dailyRate === '' ? undefined : Number(formData.dailyRate),
        level: Number(formData.level),
      }

      const response = await fetch(`${API_BASE_URL}/api/positions/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to create position.')
      }

      setFormData(initialFormState)
      setIsModalOpen(false)
      await fetchPositions()
    } catch (submitError) {
      setFormError(submitError.message || 'Something went wrong while creating position.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Positions</h1>
        <p>Manage position records and salary structure.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Position List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Position</Button>
        </div>
        {isLoading ? <p>Loading positions...</p> : null}
        {error ? <p>{error}</p> : null}
        <Table columns={positionColumns} rows={isLoading || error ? [] : positions} />
      </section>

      <Modal title="Add Position" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Position Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="departmentId">Department</label>
            <select id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="baseSalary">Base Salary</label>
            <input
              id="baseSalary"
              name="baseSalary"
              type="number"
              min="0"
              step="0.01"
              value={formData.baseSalary}
              onChange={handleChange}
              required
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
              value={formData.dailyRate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="level">Level</label>
            <input id="level" name="level" type="number" min="1" value={formData.level} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {formError ? <p>{formError}</p> : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Position'}
          </Button>
        </form>
      </Modal>
    </section>
  )
}

export default PositionsPage
