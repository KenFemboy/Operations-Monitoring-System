import { useCallback, useEffect, useMemo, useState } from 'react'
import { useBranchContext } from '../../shared/store/branchContext'
import { plantillaService } from '../services/plantillaService'

const normalizeBranchName = (value = '') =>
  value
    .toLowerCase()
    .replace(/\bmain\b/g, '')
    .replace(/\bbranch\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function usePlantilla() {
  const { activeBranch, activeBranchId, isMainBranch } = useBranchContext()
  const [branches, setBranches] = useState([])
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedBranch = useMemo(() => {
    if (activeBranchId) {
      return branches.find((branch) => branch._id === activeBranchId)
    }

    const activeBranchKey = normalizeBranchName(activeBranch)
    return branches.find((branch) => normalizeBranchName(branch.branchName) === activeBranchKey)
  }, [activeBranch, activeBranchId, branches])

  const fetchRows = useCallback(async (branchList = branches, branchOverride = selectedBranch) => {
    if (!branchList.length) {
      setRows([])
      return
    }

    const branchesToFetch =
      isMainBranch && !activeBranchId
        ? branchList
        : [branchOverride].filter(Boolean)

    if (!branchesToFetch.length) {
      setRows([])
      return
    }

    const results = await Promise.all(
      branchesToFetch.map((branch) => plantillaService.getByBranch(branch._id)),
    )

    setRows(results.flat())
  }, [activeBranchId, branches, isMainBranch, selectedBranch])

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const branchList = await plantillaService.getBranches()
      setBranches(branchList)
    } catch (err) {
      setError(err.message || 'Failed to load branch records')
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBranches()
  }, [loadBranches])

  useEffect(() => {
    if (!branches.length) {
      return
    }

    const loadRows = async () => {
      try {
        setIsLoading(true)
        setError('')
        await fetchRows()
      } catch (err) {
        setError(err.message || 'Failed to load plantilla records')
        setRows([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRows()
  }, [branches.length, fetchRows])

  const createPlantilla = async (payload) => {
    await plantillaService.create(payload)
    await fetchRows()
  }

  const updatePlantilla = async (id, payload) => {
    await plantillaService.update(id, payload)
    await fetchRows()
  }

  const deletePlantilla = async (id) => {
    await plantillaService.delete(id)
    await fetchRows()
  }

  return {
    rows,
    branches,
    isLoading,
    error,
    reloadPlantilla: () => fetchRows(),
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  }
}

export default usePlantilla
