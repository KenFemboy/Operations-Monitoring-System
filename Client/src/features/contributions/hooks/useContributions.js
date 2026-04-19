import { contributionRows } from '../services/contributionsMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useContributions() {
  const { activeBranch } = useBranchContext()

  return contributionRows.filter((item) => item.branch === activeBranch)
}

export default useContributions
