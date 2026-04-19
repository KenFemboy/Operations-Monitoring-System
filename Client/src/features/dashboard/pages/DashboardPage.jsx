import SummaryCards from '../components/SummaryCards'
import useDashboardSummary from '../hooks/useDashboardSummary'
import { salesSummaryPreview } from '../services/dashboardMockData'

function DashboardPage() {
  const summary = useDashboardSummary()

  return (
    <section>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of Ally's restaurant and buffet operations</p>
      </header>

      <SummaryCards summary={summary} />

      <section className="card">
        <h3>Payroll Trend Chart</h3>
        <div className="chart-placeholder">Chart Placeholder (No live data)</div>
      </section>

      <section className="table-card" style={{ marginTop: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Sales Summary Preview</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Customers</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {salesSummaryPreview.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.period}</td>
                  <td>{entry.customers}</td>
                  <td>{entry.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default DashboardPage
