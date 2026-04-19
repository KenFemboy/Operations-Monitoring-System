import BranchCard from '../components/BranchCard'
import useBranches from '../hooks/useBranches'

function BranchesPage() {
  const branches = useBranches()

  return (
    <section>
      <header className="page-header">
        <h1>Branches</h1>
        <p>Monitor branch locations, status, and quick report links</p>
      </header>
      <section className="branch-grid">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </section>
    </section>
  )
}

export default BranchesPage
