import Table from '../../shared/components/Table'
import CreateIncidentButton from '../components/CreateIncidentButton'
import useIncidents from '../hooks/useIncidents'
import { incidentColumns } from '../utils/incidentColumns'

function IncidentsPage() {
  const rows = useIncidents()

  return (
    <section>
      <header className="page-header">
        <h1>Incident Reports</h1>
        <p>Track and review employee incident reports (IR)</p>
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Incident List</h3>
          <CreateIncidentButton />
        </div>
        <Table columns={incidentColumns} rows={rows} />
      </section>
    </section>
  )
}

export default IncidentsPage
