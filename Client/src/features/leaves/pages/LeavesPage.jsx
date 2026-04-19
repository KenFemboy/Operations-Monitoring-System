import Button from '../../shared/components/Button'
import Table from '../../shared/components/Table'
import useLeaves from '../hooks/useLeaves'
import { leaveColumns } from '../utils/leaveColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function LeavesPage() {
  const rows = useLeaves()
  const { activeBranch, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Leaves</h1>
        <p>Review SIL, Vacation Leave, and Sick Leave requests for {activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Leave Requests</h3>
        </div>
        <Table
          columns={leaveColumns}
          rows={rows}
          renderActions={() => (
            <div className="action-row">
              <Button variant="success" disabled={isReadOnly}>Approve</Button>
              <Button variant="danger" disabled={isReadOnly}>Reject</Button>
            </div>
          )}
        />
      </section>
    </section>
  )
}

export default LeavesPage
