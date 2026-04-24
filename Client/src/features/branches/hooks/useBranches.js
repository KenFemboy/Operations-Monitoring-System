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

  return { branches, loading, error, fetchAll, searchByLocation, createBranch }
}

export const branchesService = {
  getAll: async () => {
    const result = await fetchApi('/api/branches/get-all', undefined, 'Failed to fetch branches')
    return result?.data || []
  },
}


export default useBranches
