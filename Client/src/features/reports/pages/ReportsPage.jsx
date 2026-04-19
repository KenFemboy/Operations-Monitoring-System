import { Link } from 'react-router-dom'
import ReportActionButtons from '../components/ReportActionButtons'
import useReports from '../hooks/useReports'

function ReportsPage() {
  const actions = useReports()

  return (
    <section>
      <header className="page-header">
        <h1>Reports</h1>
        <p>Review branch-level performance and export summary data</p>
      </header>
      <section className="card">
        <h3>Report Actions</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Use these actions to view and prepare report outputs.
        </p>
        <ReportActionButtons actions={actions} />
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h3>All Report Modules</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Open each report area from attendance to feedback.
        </p>
        <div className="action-row">
          <Link className="btn btn-outline" to="/attendance">Attendance Report</Link>
          <Link className="btn btn-outline" to="/employees">Employees Report</Link>
          <Link className="btn btn-outline" to="/payroll">Payroll Report</Link>
          <Link className="btn btn-outline" to="/feedback">Feedback Report</Link>
        </div>
      </section>
    </section>
  )
}

export default ReportsPage
