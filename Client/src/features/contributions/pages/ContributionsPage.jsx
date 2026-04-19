import Table from '../../shared/components/Table'
import useContributions from '../hooks/useContributions'
import { contributionColumns } from '../utils/contributionColumns'

function ContributionsPage() {
  const rows = useContributions()

  return (
    <section>
      <header className="page-header">
        <h1>Contributions</h1>
        <p>Government contribution mapping (static table)</p>
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">SSS, PhilHealth, Pag-IBIG</h3>
        </div>
        <Table columns={contributionColumns} rows={rows} />
      </section>
    </section>
  )
}

export default ContributionsPage
