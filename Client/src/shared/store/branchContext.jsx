import { createContext, useContext, useMemo, useState } from 'react'
import { getShortBranchName } from '../utils/branchName'

const branches = [
  { id: 1, name: 'Tagum City', type: 'Main Branch' },
  { id: 2, name: 'Panabo City', type: 'Branch' },
  { id: 3, name: 'Pantukan', type: 'Branch' },
]

const BranchContext = createContext(undefined)

function BranchProvider({ children, lockedBranch = null }) {
  const [activeBranch, setActiveBranchState] = useState(lockedBranch || 'Tagum City')
  const [activeBranchId, setActiveBranchId] = useState(null)

  const setActiveBranch = (nextBranch) => {
    if (lockedBranch) {
      return
    }

    setActiveBranchState(nextBranch)
    setActiveBranchId(null)
  }

  const setActiveBranchSelection = ({ id, name }) => {
    if (lockedBranch) {
      return
    }

    if (name) {
      setActiveBranchState(name)
    }
    setActiveBranchId(id || null)
  }

  const activeBranchMeta = useMemo(() => {
    return branches.find((branch) => branch.name === activeBranch) ?? branches[0]
  }, [activeBranch])

  const isMainBranch = activeBranch === 'Tagum City'
  const isReadOnly = false
  const displayBranchName = lockedBranch ? getShortBranchName(activeBranch) : activeBranch

  const value = useMemo(
    () => ({
      branches,
      activeBranch,
      activeBranchId,
      displayBranchName,
      activeBranchMeta,
      isMainBranch,
      isReadOnly,
      setActiveBranch,
      setActiveBranchSelection,
    }),
    [activeBranch, activeBranchId, displayBranchName, activeBranchMeta, isMainBranch, isReadOnly],
  )

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
}

function useBranchContext() {
  const context = useContext(BranchContext)

  if (!context) {
    throw new Error('useBranchContext must be used within BranchProvider')
  }

  return context
}

export { BranchProvider, useBranchContext }