import { useCallback, useEffect, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import EmployeeForm from '../components/EmployeeForm'
import { employeeColumns } from '../utils/employeeColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingEmployee, setEditingEmployee] = useState(null)
  const { activeBranch, isReadOnly } = useBranchContext()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`${API_BASE_URL}/api/employees/get-all`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to load employees.')
      }

      const mappedEmployees = (result?.data || []).map((employee) => ({
        id: employee?._id,
        name: `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || 'N/A',
        role: employee?.positionId?.name || 'N/A',
        assignedBranch: employee?.departmentId?.name || 'N/A',
        status: employee?.status || 'N/A',
      }))

      setEmployees(mappedEmployees)
    } catch (fetchError) {
      setError(fetchError.message || 'Something went wrong while loading employees.')
    } finally {
      setIsLoading(false)
    }
  }, [API_BASE_URL])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleEditEmployee = async (employeeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/get-all`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.message || 'Failed to load employee.')
      }

      const employee = (result?.data || []).find((emp) => emp._id === employeeId)
      if (employee) {
        setEditingEmployee(employee)
        setIsModalOpen(true)
      }
    } catch (err) {
      setError(err.message || 'Failed to load employee for editing.')
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const filteredEmployees = employees.filter((employee) => {
    if (activeBranch === 'Tagum City') {
      return true
    }

    if (!employee.assignedBranch || employee.assignedBranch === 'N/A') {
      return true
    }

    return (
      employee.assignedBranch.trim().toLowerCase() === activeBranch.trim().toLowerCase()
    )
  })

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p>Showing records for {activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Employee List</h3>
          <Button
            onClick={() => {
              setEditingEmployee(null)
              setIsModalOpen(true)
            }}
            disabled={isReadOnly}
          >
            Add Employee
          </Button>
        </div>
        {isLoading ? <p>Loading employees...</p> : null}
        {error ? <p>{error}</p> : null}
        <Table
          columns={employeeColumns}
          rows={isLoading || error ? [] : filteredEmployees}
          renderActions={(row) => (
            <div className="action-row">
              <Button
                variant="outline"
                disabled={isReadOnly}
                onClick={() => handleEditEmployee(row.id)}
              >
                Edit
              </Button>
              <Button variant="danger" disabled={isReadOnly}>Delete</Button>
            </div>
          )}
        />
      </section>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <EmployeeForm
          onClose={handleCloseModal}
          onCreated={fetchEmployees}
          initialData={editingEmployee}
          employeeId={editingEmployee?._id}
        />
      </Modal>
    </section>
  )
}

export default EmployeesPage
