import api from '../../../api/axios'

const normalizePlantilla = (row) => {
  const branch = row.branchId

  return {
    _id: row._id,
    branchId: branch?._id || row.branchId || '',
    branch: branch?.branchName || '',
    role: row.role || '',
    position: row.role || '',
    department: row.department || '',
    baseSalary: Number(row.baseSalary || 0),
    allowance: Number(row.allowance || 0),
    requiredCount: Number(row.requiredCount || 1),
    filledCount: Number(row.filledCount || 0),
    status: row.status || 'active',
    description: row.description || '',
  }
}

const normalizeBranch = (branch) => ({
  _id: branch._id || branch.id,
  branchName: branch.branchName || branch.name,
  location: branch.location || '',
})

export const plantillaService = {
  getBranches: async () => {
    const response = await api.get('/branches/get-all')
    return (response.data?.data || []).map(normalizeBranch)
  },

  getByBranch: async (branchId) => {
    const response = await api.get(`/plantilla/branch/${branchId}`)
    return (response.data?.data || []).map(normalizePlantilla)
  },

  create: async (payload) => {
    const response = await api.post('/plantilla', payload)
    return normalizePlantilla(response.data?.data)
  },

  update: async (id, payload) => {
    const response = await api.put(`/plantilla/${id}`, payload)
    return normalizePlantilla(response.data?.data)
  },

  delete: async (id) => {
    const response = await api.delete(`/plantilla/${id}`)
    return normalizePlantilla(response.data?.data)
  },
}
