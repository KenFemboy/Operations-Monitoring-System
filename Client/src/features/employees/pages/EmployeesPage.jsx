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
    middleName: employee.middleName || '',
    birthDate: employee.birthDate || '',
    gender: employee.gender || '',
    role: employee.role || employee.positionId?.name || 'N/A',
    plantillaId: employee.plantillaId?._id || employee.plantillaId || '',
    assignedBranch: employee.assignedBranchId?.branchName || 'N/A',
    assignedBranchId: employee.assignedBranchId?._id || '',
    dateHired: employee.dateHired || '',
    status: employee.status || 'active',
    address: employee.address || '',
    contactNumber: employee.contactNumber || '',
    email: employee.email || '',
    governmentIds: {
      sss: employee.governmentIds?.sss || '',
      philhealth: employee.governmentIds?.philhealth || '',
      pagibig: employee.governmentIds?.pagibig || '',
      tin: employee.governmentIds?.tin || '',
    },
  }
}

const toStatusLabel = (status) => {
  if (!status) {
    return 'N/A'
  }

  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`
}

const ALL_BRANCHES = 'ALL_BRANCHES'

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [branches, setBranches] = useState([])
  const [selectedBranchId, setSelectedBranchId] = useState(ALL_BRANCHES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const { activeBranch, activeBranchId, displayBranchName, isReadOnly } = useBranchContext()

  const loadEmployees = async (branchIdFilter = selectedBranchId) => {
    try {
      setLoading(true)
      setError('')
      const employeeData =
        branchIdFilter && branchIdFilter !== ALL_BRANCHES
          ? await employeesService.getByBranchId(branchIdFilter)
          : await employeesService.getAll()
      setEmployees(employeeData.map(toEmployeeRecord))
    } catch (err) {
      setError(err.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchData = await branchesService.getAll()
        setBranches(
          branchData.map((branch) => ({
            id: branch.id || branch._id,
            name: branch.branchName,
          })),
        )
      } catch (err) {
        setError(err.message || 'Failed to load branch options')
      }
    }

    loadBranches()
  }, [])

  useEffect(() => {
    if (activeBranchId) {
      setSelectedBranchId(activeBranchId)
      return
    }

    setSelectedBranchId(ALL_BRANCHES)
  }, [activeBranchId, activeBranch])

  useEffect(() => {
    loadEmployees(selectedBranchId)
  }, [selectedBranchId])

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

      await loadEmployees(selectedBranchId)
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
    if (selectedBranchId && selectedBranchId !== ALL_BRANCHES) {
      return employee.assignedBranchId === selectedBranchId
    }
    return true
  })

  const branchOptionsForForm = branches
  const selectedBranchLabel =
    selectedBranchId === ALL_BRANCHES
      ? 'All Branches'
      : branches.find((branch) => branch.id === selectedBranchId)?.name ||
        displayBranchName ||
        activeBranch

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p>Showing records for {selectedBranchLabel}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Employee List</h3>
          <div className="form-group" style={{ minWidth: '220px', margin: 0 }}>
            <label htmlFor="employeeBranchFilter">Filter by Branch</label>
            <select
              id="employeeBranchFilter"
              name="employeeBranchFilter"
              value={selectedBranchId}
              onChange={(event) => setSelectedBranchId(event.target.value)}
            >
              <option value={ALL_BRANCHES}>All Employees</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
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
