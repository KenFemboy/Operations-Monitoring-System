import Table from '../../shared/components/Table'
import CreateIncidentButton from '../components/CreateIncidentButton'
import useIncidents from '../hooks/useIncidents'
import { incidentColumns } from '../utils/incidentColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function IncidentsPage() {
  const rows = useIncidents()
  const { activeBranch, displayBranchName, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Incident Reports</h1>
        <p>Track and review employee incident reports (IR) for {displayBranchName || activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Incident List</h3>
          <CreateIncidentButton disabled={isReadOnly} />
        </div>
        <Table columns={incidentColumns} rows={rows} />
      </section>
    </section>
  )
}

export default IncidentsPage
