import { Link, useParams } from 'react-router-dom'
import { attendanceRows } from '../../attendance/services/attendanceMockService'
import { employeeRows } from '../../employees/services/employeesMockService'
import { feedbackRows } from '../../feedback/services/feedbackMockService'
import { payrollRows } from '../../payroll/services/payrollMockService'
import Card from '../../shared/components/Card'
import { branchRows } from '../services/branchesMockService'
import { formatStars } from '../../feedback/utils/feedbackHelpers'

function BranchDetailsPage() {
  const { branchId } = useParams()
  const selectedBranch = branchRows.find((branch) => branch.id === Number(branchId))

  if (!selectedBranch) {
    return (
      <section>
        <header className="page-header">
          <h1>Branch Not Found</h1>
          <p>The requested branch data is not available.</p>
        </header>
        <Link className="inline-link" to="/branches">
          Back to Branches
        </Link>
      </section>
    )
  }

  const attendanceByBranch = attendanceRows.filter(
    (row) => row.branch === selectedBranch.name,
  )
  const employeesByBranch = employeeRows.filter(
    (row) => row.assignedBranch === selectedBranch.name,
  )
  const payrollByBranch = payrollRows.filter(
    (row) => row.branch === selectedBranch.name,
  )
  const feedbackByBranch = feedbackRows.filter(
    (row) => row.branch === selectedBranch.name,
  )

  return (
    <section>
      <header className="page-header">
        <h1>{selectedBranch.name}</h1>
        <p>
          Superadmin branch report view from attendance to feedback ({selectedBranch.location})
        </p>
      </header>

      <div className="grid-4">
        <Card title="Attendance Records" value={attendanceByBranch.length} />
        <Card title="Employees" value={employeesByBranch.length} />
        <Card title="Payroll Entries" value={payrollByBranch.length} />
        <Card title="Feedback Entries" value={feedbackByBranch.length} />
      </div>

      <section className="table-card" style={{ marginBottom: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Attendance Report</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceByBranch.map((row) => (
                <tr key={row.id}>
                  <td>{row.employeeName}</td>
                  <td>{row.date}</td>
                  <td>{row.timeIn || '--'}</td>
                  <td>{row.timeOut || '--'}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card" style={{ marginBottom: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Employees Report</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employeesByBranch.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="table-card" style={{ marginBottom: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Payroll Report</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Salary</th>
                <th>Deductions</th>
                <th>Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {payrollByBranch.map((row) => (
                <tr key={row.id}>
                  <td>{row.employee}</td>
                  <td>{row.salary}</td>
                  <td>{row.deductions}</td>
                  <td>{row.netPay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Feedback Report</h3>
        <ul className="recent-list" style={{ marginTop: '0.65rem' }}>
          {feedbackByBranch.map((row) => (
            <li key={row.id}>
              {formatStars(row.rating)} {row.comment} - {row.customerName}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default BranchDetailsPage
