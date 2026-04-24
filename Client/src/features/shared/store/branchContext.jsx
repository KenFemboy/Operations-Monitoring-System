import { createContext, useContext, useMemo, useState } from 'react'

const branches = [
  { id: 1, name: 'Tagum Main Branch', type: 'Main Branch' },
  { id: 2, name: 'Panabo Branch', type: 'Branch' },
  { id: 3, name: 'Quezon City Branch', type: 'Branch' },
]

const BranchContext = createContext(undefined)

function BranchProvider({ children }) {
  const [activeBranch, setActiveBranch] = useState('Tagum Main Branch')

  const activeBranchMeta = useMemo(() => {
    return branches.find((branch) => branch.name === activeBranch) ?? branches[0]
  }, [activeBranch])

  const isMainBranch = activeBranch === 'Tagum Main Branch'
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