import { createContext, useContext, useMemo, useState } from 'react'

const branches = [
  { id: 1, name: 'Tagum City', type: 'Main Branch' },
  { id: 2, name: 'Panabo City', type: 'Branch' },
  { id: 3, name: 'Pantukan', type: 'Branch' },
]

const BranchContext = createContext(undefined)

function BranchProvider({ children }) {
  const [activeBranch, setActiveBranch] = useState('Tagum City')

  const activeBranchMeta = useMemo(() => {
    return branches.find((branch) => branch.name === activeBranch) ?? branches[0]
  }, [activeBranch])

  const isMainBranch = activeBranch === 'Tagum City'
  const isReadOnly = !isMainBranch

  const value = useMemo(
    () => ({
      branches,
      activeBranch,
      activeBranchMeta,
      isMainBranch,
      isReadOnly,
      setActiveBranch,
    }),
    [activeBranch, activeBranchMeta, isMainBranch, isReadOnly],
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