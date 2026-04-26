import Table from '../../shared/components/Table'
import IssueNteButton from '../components/IssueNteButton'
import useNte from '../hooks/useNte'
import { nteColumns } from '../utils/nteColumns'
import { useBranchContext } from '../../shared/store/branchContext'

function NtePage() {
  const rows = useNte()
  const { activeBranch, displayBranchName, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Notice to Explain</h1>
        <p>Issue and monitor NTE records for {displayBranchName || activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">NTE Registry</h3>
          <IssueNteButton disabled={isReadOnly} />
        </div>
        <Table columns={nteColumns} rows={rows} />
      </section>
    </section>
  )
}

export default NtePage
