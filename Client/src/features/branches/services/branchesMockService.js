const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const branchesService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/branches/get-all`)
    if (!response.ok) throw new Error('Failed to fetch branches')
    const result = await response.json()
    return result.data || []
  },

  getByLocation: async (location) => {
    const response = await fetch(`${API_BASE_URL}/api/branches/get-by-location/${encodeURIComponent(location)}`)
    if (!response.ok) throw new Error('Failed to fetch branches by location')
    const result = await response.json()
    return result.data || []
  },

  create: async (branchData) => {
    const response = await fetch(`${API_BASE_URL}/api/branches/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create branch')
    }
    return await response.json()
  },
}

// Legacy mock data for reference
export const branchRows = [
  { id: 1, name: 'Tagum City', type: 'Main Branch', location: 'Tagum City, Davao del Norte', status: 'Operational' },
  { id: 2, name: 'Panabo City', type: 'Branch', location: 'Panabo City, Davao del Norte', status: 'Operational' },
  { id: 3, name: 'Pantukan', type: 'Branch', location: 'Pantukan, Davao de Oro', status: 'Operational' },
]
