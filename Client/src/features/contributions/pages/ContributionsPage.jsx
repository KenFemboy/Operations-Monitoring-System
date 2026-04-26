import Table from '../../shared/components/Table'
import useContributions from '../hooks/useContributions'
import { contributionColumns } from '../utils/contributionColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function ContributionsPage() {
  const rows = useContributions()
  const { activeBranch, displayBranchName, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Contributions</h1>
        <p>SSS, Pag-IBIG, and PhilHealth breakdown for {displayBranchName || activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
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
