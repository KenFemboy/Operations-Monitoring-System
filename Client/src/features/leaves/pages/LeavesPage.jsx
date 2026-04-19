import Button from '../../shared/components/Button'
import Table from '../../shared/components/Table'
import useLeaves from '../hooks/useLeaves'
import { leaveColumns } from '../utils/leaveColumns'

function LeavesPage() {
  const rows = useLeaves()

  return (
    <section>
      <header className="page-header">
        <h1>Leaves</h1>
        <p>Review and act on leave requests (UI only)</p>
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
              <Button variant="success">Approve</Button>
              <Button variant="danger">Reject</Button>
            </div>
          )}
        />
      </section>
    </section>
  )
}

export default LeavesPage
