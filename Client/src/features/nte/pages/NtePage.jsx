import Table from '../../shared/components/Table'
import IssueNteButton from '../components/IssueNteButton'
import useNte from '../hooks/useNte'
import { nteColumns } from '../utils/nteColumns'

function NtePage() {
  const rows = useNte()

  return (
    <section>
      <header className="page-header">
        <h1>Notice to Explain</h1>
        <p>Issue and monitor NTE records for employee cases</p>
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">NTE Registry</h3>
          <IssueNteButton />
        </div>
        <Table columns={nteColumns} rows={rows} />
      </section>
    </section>
  )
}

export default NtePage
