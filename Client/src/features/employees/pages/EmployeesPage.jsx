import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import EmployeeForm from '../components/EmployeeForm'
import { employeeColumns } from '../utils/employeeColumns'
import { useBranchContext } from '../../shared/store/branchContext'
import { employeeRows } from '../services/employeesMockService'

const toEmployeeRecord = (employee) => {
  const [firstName = '', ...lastParts] = employee.name.split(' ')

  return {
    id: employee.id,
    firstName,
    lastName: lastParts.join(' '),
    name: employee.name,
    role: employee.role,
    assignedBranch: employee.assignedBranch,
    status: employee.status,
    address: '',
    contactNumber: '',
    email: '',
  }
}

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState(() => employeeRows.map(toEmployeeRecord))
  const [editingEmployee, setEditingEmployee] = useState(null)
  const { activeBranch, isReadOnly } = useBranchContext()

  const tableRows = useMemo(
    () =>
      employees.map((employee) => ({
        ...employee,
        name: `${employee.firstName} ${employee.lastName}`.trim(),
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

  const handleSaveEmployee = (payload) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === editingEmployee.id
            ? {
                ...employee,
                ...payload,
              }
            : employee,
        ),
      )
    } else {
      const nextId = employees.length ? Math.max(...employees.map((employee) => employee.id)) + 1 : 1
      setEmployees((prev) => [
        ...prev,
        {
          id: nextId,
          ...payload,
        },
      ])
    }

    handleCloseModal()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const filteredEmployees = tableRows.filter((employee) => {
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
        <Table
          columns={employeeColumns}
          rows={filteredEmployees}
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
        />
      </Modal>
    </section>
  )
}

export default EmployeesPage
