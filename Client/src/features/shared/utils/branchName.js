export const getShortBranchName = (branchName = '') => {
  if (!branchName) return ''

  const words = branchName.trim().split(/\s+/)
  if (words.length <= 2) {
    return branchName.trim()
  }

  return words.slice(0, 2).join(' ')
}
