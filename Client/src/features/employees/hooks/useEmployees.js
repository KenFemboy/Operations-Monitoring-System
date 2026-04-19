import { employeeRows } from '../services/employeesMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useEmployees() {
  const { activeBranch } = useBranchContext()

  return employeeRows.filter((employee) => employee.assignedBranch === activeBranch)
}

export default useEmployees
