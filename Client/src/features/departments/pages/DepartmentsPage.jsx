import { useCallback, useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import { departmentColumns } from '../utils/departmentColumns'

const initialFormState = {
  name: '',
  branch: '',
  location: '',
  description: '',
  status: 'active',
}

function DepartmentsPage() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState(initialFormState)

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/departments/get-all`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to load departments.')
      }

      const mappedDepartments = (result?.data || []).map((department) => ({
        id: department._id,
        name: department.name || 'N/A',
        branch: department.branch || 'N/A',
        location: department.location || '-',
        description: department.description || '-',
        status: department.status || 'N/A',
      }))

      setDepartments(mappedDepartments)
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while loading departments.')
    } finally {
      setIsLoading(false)
    }
  }, [API_BASE_URL])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/departments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to create department.')
      }

      setFormData(initialFormState)
      setIsModalOpen(false)
      await fetchDepartments()
    } catch (submitError) {
      setFormError(submitError.message || 'Something went wrong while creating department.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Departments</h1>
        <p>Manage department records and status.</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Department List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Department</Button>
        </div>
        {isLoading ? <p>Loading departments...</p> : null}
        {error ? <p>{error}</p> : null}
        <Table columns={departmentColumns} rows={isLoading || error ? [] : departments} />
      </section>

      <Modal title="Add Department" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Department Name</label>
            <input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <input id="branch" name="branch" value={formData.branch} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input id="description" name="description" value={formData.description} onChange={handleChange} />
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
            {isSubmitting ? 'Saving...' : 'Save Department'}
          </Button>
        </form>
      </Modal>
    </section>
  )
}

export default DepartmentsPage
