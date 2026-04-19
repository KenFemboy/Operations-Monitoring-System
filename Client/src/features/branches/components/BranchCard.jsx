import { Link } from 'react-router-dom'
import { getBranchStatusClass } from '../utils/branchHelpers'

function BranchCard({ branch }) {
  return (
    <article className="branch-card">
      <h3>{branch.name}</h3>
      <p>{branch.location}</p>
      <p className={getBranchStatusClass(branch.status)}>{branch.status}</p>
      <Link className="inline-link" to={`/branches/${branch.id}`}>
        View Branch Details
      </Link>
    </article>
  )
}

export default BranchCard
