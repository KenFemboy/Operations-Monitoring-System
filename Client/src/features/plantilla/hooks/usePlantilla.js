import { useBranchContext } from '../../shared/store/branchContext'
import { plantillaRows } from '../services/plantillaMockService'

function usePlantilla() {
  const { activeBranch } = useBranchContext()

  return plantillaRows.filter((row) => row.branch === activeBranch)
}

export default usePlantilla
