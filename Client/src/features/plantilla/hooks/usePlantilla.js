import { useMemo, useState } from 'react'
import { useBranchContext } from '../../shared/store/branchContext'
import { plantillaRows as initialPlantillaRows } from '../services/plantillaMockService'

const normalizeBranch = (value = '') =>
  value
    .toLowerCase()
    .replace(/\bmain\b/g, '')
    .replace(/\bbranch\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const toCurrencyNumber = (value) => {
  if (typeof value === 'number') {
    return value
  }

  const parsed = Number(String(value || '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const toViewRow = (row) => ({
  _id: row._id || row.id || `${row.branch}-${row.role}`,
  branchId: row.branchId || '',
  branch: row.branch || '',
  role: row.role || row.position || '',
  position: row.position || row.role || '',
  baseSalary: toCurrencyNumber(row.baseSalary),
  allowance: toCurrencyNumber(row.allowance),
  requiredCount: row.requiredCount ?? 1,
  filledCount: row.filledCount ?? 0,
  status: row.status || 'active',
  description: row.description || '',
})

function usePlantilla() {
  const { activeBranch, isMainBranch } = useBranchContext()
  const [allRows, setAllRows] = useState(() => initialPlantillaRows.map(toViewRow))

  const rows = useMemo(() => {
    if (isMainBranch) {
      return allRows
    }

    const activeBranchKey = normalizeBranch(activeBranch)
    return allRows.filter((row) => normalizeBranch(row.branch) === activeBranchKey)
  }, [activeBranch, allRows, isMainBranch])

  const createPlantilla = (payload) => {
    const nextRow = toViewRow({
      _id: `${Date.now()}`,
      ...payload,
      branch: payload.branch || activeBranch,
    })

    setAllRows((prev) => [...prev, nextRow])
  }

  const updatePlantilla = (id, payload) => {
    setAllRows((prev) =>
      prev.map((row) =>
        row._id === id
          ? toViewRow({
              ...row,
              ...payload,
              _id: row._id,
            })
          : row,
      ),
    )
  }

  const deletePlantilla = (id) => {
    setAllRows((prev) => prev.filter((row) => row._id !== id))
  }

  return {
    rows,
    createPlantilla,
    updatePlantilla,
    deletePlantilla,
  }
}

export default usePlantilla
