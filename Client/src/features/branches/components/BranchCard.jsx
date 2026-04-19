import Button from '../../shared/components/Button'
import { getBranchStatusClass } from '../utils/branchHelpers'
import { useBranchContext } from '../../shared/store/branchContext'
import { useNavigate } from 'react-router-dom'

function BranchCard({ branch }) {
  const { setActiveBranch } = useBranchContext()
  const navigate = useNavigate()

  const handleViewBranch = () => {
    setActiveBranch(branch.name)
    navigate('/dashboard')
  }

  return (
    <article className="branch-card">
      <h3>{branch.name}</h3>
      <p>{branch.type}</p>
      <p>{branch.location}</p>
      <p className={getBranchStatusClass(branch.status)}>{branch.status}</p>
      <Button variant="outline" onClick={handleViewBranch}>View Branch</Button>
    </article>
  )
}

export default BranchCard
