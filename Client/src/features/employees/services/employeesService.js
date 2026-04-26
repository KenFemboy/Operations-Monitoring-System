const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_FALLBACK_URL = 'http://localhost:7000'

const parseResponse = async (response, fallbackMessage) => {
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage)
  }

  return result
}

const fetchApi = async (path, options, fallbackMessage) => {
  const token = localStorage.getItem('token')
  const headers = {
    ...(options?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const requestOptions = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, requestOptions)
    return await parseResponse(response, fallbackMessage)
  } catch (error) {
    if (error instanceof TypeError && API_BASE_URL !== API_FALLBACK_URL) {
      try {
        const fallbackResponse = await fetch(`${API_FALLBACK_URL}${path}`, requestOptions)
        return await parseResponse(fallbackResponse, fallbackMessage)
      } catch {
        throw new Error(
          'Failed to fetch. Make sure backend is running and VITE_API_URL matches your API port (8000 or 7000).',
        )
      }
    }

    if (error instanceof TypeError) {
      throw new Error(
        'Failed to fetch. Make sure backend is running and VITE_API_URL matches your API port (8000 or 7000).',
      )
    }

    throw error
  }
}

export const employeesService = {
  getAll: async () => {
    const result = await fetchApi('/api/employees/get-all', undefined, 'Failed to fetch employees')
    return result?.data || []
  },

  getByBranchId: async (branchId) => {
    if (!branchId) {
      return []
    }

    const result = await fetchApi(
      `/api/employees/by-branch/${branchId}`,
      undefined,
      'Failed to fetch employees by branch',
    )
    return result?.data || []
  },

  create: async (payload) => {
    const result = await fetchApi('/api/employees/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, 'Failed to create employee')
    return result?.data
  },

  update: async (id, payload) => {
    const result = await fetchApi(`/api/employees/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, 'Failed to update employee')
    return result?.data
  },
}

export const branchesService = {
  getAll: async () => {
    const result = await fetchApi('/api/branches/get-all', undefined, 'Failed to fetch branches')
    return result?.data || []
  },
}
