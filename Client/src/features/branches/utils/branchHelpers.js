export function getBranchStatusClass(status) {
  if (!status) return 'status-neutral'
  const lowerStatus = status.toLowerCase()
  if (lowerStatus === 'operational' || lowerStatus === 'active') return 'status-positive'
  if (lowerStatus === 'under maintenance' || lowerStatus === 'inactive') return 'status-warning'
  return 'status-neutral'
}

export function formatBranchData(branch) {
  return {
    id: branch._id || branch.id,
    branchName: branch.branchName || branch.name || 'N/A',
    location: branch.location || 'N/A',
    address: branch.address || '-',
    description: branch.description || '-',
    status: branch.status || 'Active',
  }
}
