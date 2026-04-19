import { inventoryRows } from '../services/inventoryMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useInventory() {
  const { activeBranch } = useBranchContext()

  return inventoryRows.filter((item) => item.branch === activeBranch)
}

export default useInventory
