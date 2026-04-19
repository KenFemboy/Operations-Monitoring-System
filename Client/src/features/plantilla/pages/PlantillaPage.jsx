import Table from '../../shared/components/Table'
import { useBranchContext } from '../../shared/store/branchContext'
import usePlantilla from '../hooks/usePlantilla'
import { plantillaColumns } from '../utils/plantillaColumns'

function PlantillaPage() {
  const rows = usePlantilla()
  const { activeBranch, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Plantilla</h1>
        <p>Employee positions and salary structure for {activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Role and Salary Structure</h3>
        </div>
        <Table columns={plantillaColumns} rows={rows} />
      </section>
    </section>
  )
}

export default PlantillaPage
