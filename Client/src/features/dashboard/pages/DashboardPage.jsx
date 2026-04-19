import { Link } from 'react-router-dom'
import SummaryCards from '../components/SummaryCards'
import useDashboardSummary from '../hooks/useDashboardSummary'
import {
  branchOverviewRows,
  salesSummaryPreview,
} from '../services/dashboardMockData'

function DashboardPage() {
  const summary = useDashboardSummary()

  return (
    <section>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Superadmin overview for all Ally's branches</p>
      </header>

      <SummaryCards summary={summary} />

      <section className="table-card" style={{ marginBottom: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Branch Directory</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Overview</th>
              </tr>
            </thead>
            <tbody>
              {branchOverviewRows.map((branch) => (
                <tr key={branch.id}>
                  <td>{branch.branchName}</td>
                  <td>{branch.location}</td>
                  <td>{branch.status}</td>
                  <td>
                    <Link className="inline-link" to={`/branches/${branch.id}`}>
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Sales Trend Chart</h3>
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
                <th>Cluster</th>
                <th>Sales</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {salesSummaryPreview.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.period}</td>
                  <td>{entry.sales}</td>
                  <td>{entry.growth}</td>
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
