import { useState, useCallback } from 'react'
import { branchesService } from '../services/branchesMockService'

function useBranches() {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await branchesService.getAll()
      setBranches(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch branches')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchByLocation = useCallback(async (location) => {
    try {
      setLoading(true)
      setError('')
      const data = await branchesService.getByLocation(location)
      setBranches(data)
    } catch (err) {
      setError(err.message || 'Failed to search branches')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBranch = useCallback(async (branchData) => {
    try {
      setError('')
      const result = await branchesService.create(branchData)
      await fetchAll()
      return result
    } catch (err) {
      setError(err.message || 'Failed to create branch')
      throw err
    }
  }, [fetchAll])

  const updateBranch = useCallback(async (branchId, branchData) => {
    try {
      setError('')
      const result = await branchesService.update(branchId, branchData)
      await fetchAll()
      return result
    } catch (err) {
      setError(err.message || 'Failed to update branch')
      throw err
    }
  }, [fetchAll])

  return { branches, loading, error, fetchAll, searchByLocation, createBranch, updateBranch }
}

export default useBranches
