import { incidentRows } from '../services/incidentsMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useIncidents() {
  const { activeBranch } = useBranchContext()

  return incidentRows.filter((item) => item.branch === activeBranch)
}

export default useIncidents
