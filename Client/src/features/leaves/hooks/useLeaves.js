import { leaveRows } from '../services/leavesMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useLeaves() {
  const { activeBranch } = useBranchContext()

  return leaveRows.filter((item) => item.branch === activeBranch)
}

export default useLeaves
