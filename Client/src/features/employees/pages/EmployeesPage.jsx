import { useEffect, useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import EmployeeForm from '../components/EmployeeForm'
import { employeeColumns } from '../utils/employeeColumns'
import { useBranchContext } from '../../shared/store/branchContext'
import { branchesService, employeesService } from '../services/employeesService'

const toEmployeeRecord = (employee) => {
  return {
    id: employee._id,
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    role: employee.role || employee.positionId?.name || 'N/A',
    assignedBranch: employee.assignedBranchId?.branchName || 'N/A',
    assignedBranchId: employee.assignedBranchId?._id || '',
    status: employee.status || 'active',
    address: employee.address || '',
    contactNumber: employee.contactNumber || '',
    email: employee.email || '',
  }
}

const toStatusLabel = (status) => {
  if (!status) {
    return 'N/A'
  }

  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`
}

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const { activeBranch, displayBranchName, isMainBranch, isReadOnly } = useBranchContext()

  const loadEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const [employeeData, branchData] = await Promise.all([
        employeesService.getAll(),
        branchesService.getAll(),
      ])

      setEmployees(employeeData.map(toEmployeeRecord))
      setBranches(
        branchData.map((branch) => ({
          id: branch._id,
          name: branch.branchName,
        })),
      )
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const tableRows = useMemo(
    () =>
      employees.map((employee) => ({
        ...employee,
        name: `${employee.firstName} ${employee.lastName}`.trim(),
        status: toStatusLabel(employee.status),
      })),
    [employees],
  )

  const handleEditEmployee = (employeeId) => {
    const employee = employees.find((row) => row.id === employeeId)
    if (!employee) {
      return
    }

    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleSaveEmployee = async (payload) => {
    try {
      setIsSaving(true)
      setError('')

      if (editingEmployee) {
        await employeesService.update(editingEmployee.id, payload)
      } else {
        await employeesService.create(payload)
      }

      await loadEmployees()
      handleCloseModal()
    } catch (err) {
      setError(err.message || 'Failed to save employee')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const filteredEmployees = tableRows.filter((employee) => {
    if (isMainBranch) {
      return true
    }

    if (!employee.assignedBranch || employee.assignedBranch === 'N/A') {
      return false
    }

    return (
      employee.assignedBranch.trim().toLowerCase() === activeBranch.trim().toLowerCase()
    )
  })

  const branchOptionsForForm = isMainBranch
    ? branches
    : branches.filter(
        (branch) =>
          branch.name.trim().toLowerCase() === activeBranch.trim().toLowerCase(),
      )

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p>Showing records for {displayBranchName || activeBranch}</p>
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
        {loading ? <p>Loading employees...</p> : null}
        {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        <Table
          columns={employeeColumns}
          rows={loading ? [] : filteredEmployees}
          renderActions={(row) => (
            <div className="action-row">
              <Button
                variant="outline"
                disabled={isReadOnly}
                onClick={() => handleEditEmployee(row.id)}
              >
                Edit
              </Button>
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
          onSave={handleSaveEmployee}
          initialData={editingEmployee}
          branchOptions={branchOptionsForForm}
          isSaving={isSaving}
        />
      </Modal>
    </section>
  )
}

export default EmployeesPage
