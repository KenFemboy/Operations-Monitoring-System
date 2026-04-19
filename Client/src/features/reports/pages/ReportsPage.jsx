import ReportActionButtons from '../components/ReportActionButtons'
import useReports from '../hooks/useReports'

function ReportsPage() {
  const actions = useReports()

  return (
    <section>
      <header className="page-header">
        <h1>Reports</h1>
        <p>Generate and review key business reports</p>
      </header>
      <section className="card">
        <h3>Report Actions</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Use these actions to view and prepare report outputs.
        </p>
        <ReportActionButtons actions={actions} />
      </section>
    </section>
  )
}

export default ReportsPage
