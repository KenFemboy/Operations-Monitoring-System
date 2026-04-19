import ReportActionButtons from '../components/ReportActionButtons'
import useReports from '../hooks/useReports'

function ReportsPage() {
  const actions = useReports()

  return (
    <section>
      <header className="page-header">
        <h1>Reports</h1>
        <p>Generate restaurant summaries and export-ready mock reports</p>
      </header>
      <section className="card">
        <h3>Report Actions</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          These buttons are placeholders with no real export process.
        </p>
        <ReportActionButtons actions={actions} />
      </section>
    </section>
  )
}

export default ReportsPage
