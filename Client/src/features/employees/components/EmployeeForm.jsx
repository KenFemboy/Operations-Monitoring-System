import Button from '../../shared/components/Button'

function EmployeeForm({ onClose }) {
  return (
    <form>
      <div className="form-group">
        <label htmlFor="employeeName">Employee Name</label>
        <input id="employeeName" placeholder="Sample Employee" />
      </div>
      <div className="form-group">
        <label htmlFor="employeeRole">Role</label>
        <input id="employeeRole" placeholder="Role" />
      </div>
      <div className="form-group">
        <label htmlFor="employeeDepartment">Department</label>
        <input id="employeeDepartment" placeholder="Department" />
      </div>
      <Button variant="primary" onClick={onClose}>Save Employee</Button>
    </form>
  )
}

export default EmployeeForm
