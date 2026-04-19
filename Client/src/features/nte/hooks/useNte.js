import { nteRows } from '../services/nteMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useNte() {
  const { activeBranch } = useBranchContext()

  return nteRows.filter((item) => item.branch === activeBranch)
}

export default useNte
