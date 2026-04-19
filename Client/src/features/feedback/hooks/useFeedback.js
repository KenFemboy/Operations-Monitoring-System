import { feedbackRows } from '../services/feedbackMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useFeedback() {
  const { activeBranch } = useBranchContext()

  return feedbackRows.filter((row) => row.branch === activeBranch)
}

export default useFeedback
