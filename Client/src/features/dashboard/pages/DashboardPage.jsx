import SummaryCards from '../components/SummaryCards'
import useDashboardSummary from '../hooks/useDashboardSummary'
import {
  branchOverviewRows,
} from '../services/dashboardMockData'
import { useBranchContext } from '../../shared/store/branchContext'
import { useMemo } from 'react'
import { salesBreakdown } from '../../sales/services/salesMockService'
import Button from '../../shared/components/Button'

function DashboardPage() {
  const summary = useDashboardSummary()
  const { activeBranch, activeBranchMeta, isReadOnly, setActiveBranch } = useBranchContext()
  const activeSalesRows = useMemo(() => {
    return salesBreakdown.filter((row) => row.branch === activeBranch)
  }, [activeBranch])

  return (
    <section>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>
          Active Branch: {activeBranch}
          {activeBranchMeta.type === 'Main Branch' ? ` (${activeBranchMeta.type})` : ''}
        </p>
        <p className={isReadOnly ? 'readonly-label' : 'fullaccess-label'}>
          {isReadOnly ? 'View Only Mode' : 'Full Access'}
        </p>
      </header>

      <SummaryCards summary={summary} />

      <section className="grid-4" style={{ marginBottom: '1rem' }}>
        {branchOverviewRows.map((branch) => (
          <article className="branch-card" key={branch.id}>
            <h3>{branch.branchName}</h3>
            <p>{branch.type}</p>
            <p>{branch.location}</p>
            <p className="status-positive">{branch.status}</p>
            <Button variant="outline" onClick={() => setActiveBranch(branch.branchName)}>
              View Branch
            </Button>
          </article>
        ))}
      </section>

      <section className="table-card" style={{ marginBottom: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Branch Directory</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {branchOverviewRows.map((branch) => (
                <tr key={branch.id}>
                  <td>{branch.branchName}</td>
                  <td>{branch.type}</td>
                  <td>{branch.location}</td>
                  <td>{branch.status}</td>
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
          <h3 className="table-title">Sales Summary Preview ({activeBranch})</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer Type</th>
                <th>Count</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {activeSalesRows.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.customerType}</td>
                  <td>{entry.count}</td>
                  <td>{entry.rate}</td>
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
