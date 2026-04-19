import { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import EmployeeForm from '../components/EmployeeForm'
import useEmployees from '../hooks/useEmployees'
import { employeeColumns } from '../utils/employeeColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const employees = useEmployees()
  const { activeBranch, isReadOnly } = useBranchContext()

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
          <Button onClick={() => setIsModalOpen(true)} disabled={isReadOnly}>Add Employee</Button>
        </div>
        <Table
          columns={employeeColumns}
          rows={employees}
          renderActions={() => (
            <div className="action-row">
              <Button variant="outline" disabled={isReadOnly}>Edit</Button>
              <Button variant="danger" disabled={isReadOnly}>Delete</Button>
            </div>
          )}
        />
      </section>

      <Modal
        title="Add Employee"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <EmployeeForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </section>
  )
}

export default EmployeesPage
