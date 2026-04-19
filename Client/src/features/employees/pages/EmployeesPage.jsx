import { useState } from 'react'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import Table from '../../shared/components/Table'
import EmployeeForm from '../components/EmployeeForm'
import useEmployees from '../hooks/useEmployees'
import { employeeColumns } from '../utils/employeeColumns'

function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const employees = useEmployees()

  return (
    <section>
      <header className="page-header">
        <h1>Employees</h1>
        <p>Manage employee records</p>
      </header>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Employee List</h3>
          <Button onClick={() => setIsModalOpen(true)}>Add Employee</Button>
        </div>
        <Table columns={employeeColumns} rows={employees} />
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
