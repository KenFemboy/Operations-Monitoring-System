import {
  dailySalesRows,
  monthlySalesRows,
  salesBreakdown,
} from '../services/salesMockService'
import {
  calculateEstimatedRevenue,
  calculateTotalCustomers,
} from '../utils/salesHelpers'
import { useBranchContext } from '../../shared/store/branchContext'

function useSalesSummary() {
  const { activeBranch } = useBranchContext()
  const rows = salesBreakdown.filter((row) => row.branch === activeBranch)
  const branchDailyRows = dailySalesRows.filter((row) => row.branch === activeBranch)
  const branchMonthlyRow = monthlySalesRows.find((row) => row.branch === activeBranch)

  const totalCustomers = calculateTotalCustomers(rows)
  const estimatedRevenue = calculateEstimatedRevenue(rows)
  const dailySales = branchDailyRows[0]?.total ?? 0
  const monthlySales = branchMonthlyRow?.total ?? 0
  const totalDailySales = branchDailyRows.reduce((sum, row) => sum + row.total, 0)

  return {
    rows,
    dailySales,
    monthlySales,
    totalDailySales,
    totalCustomers,
    estimatedRevenue,
  }
}

export default useSalesSummary
