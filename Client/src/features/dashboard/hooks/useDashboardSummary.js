import { useMemo } from 'react'
import { branchOverviewRows } from '../services/dashboardMockData'
import { employeeRows } from '../../employees/services/employeesMockService'
import { salesBreakdown } from '../../sales/services/salesMockService'
import { calculateEstimatedRevenue } from '../../sales/utils/salesHelpers'
import { useBranchContext } from '../../shared/store/branchContext'

function useDashboardSummary() {
  const { activeBranch } = useBranchContext()

  return useMemo(() => {
    const branchEmployeeRows = employeeRows.filter(
      (row) => row.assignedBranch === activeBranch,
    )
    const branchSalesRows = salesBreakdown.filter(
      (row) => row.branch === activeBranch,
    )

    return {
      totalBranches: branchOverviewRows.length,
      totalEmployees: branchEmployeeRows.length,
      totalSales: calculateEstimatedRevenue(branchSalesRows),
    }
  }, [activeBranch])
}

export default useDashboardSummary
