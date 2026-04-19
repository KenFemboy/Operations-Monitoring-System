export function getBranchStatusClass(status) {
  if (status === 'Operational') return 'status-positive'
  if (status === 'Under Maintenance') return 'status-warning'
  return 'status-neutral'
}
