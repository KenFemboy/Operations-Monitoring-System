import { salesBreakdown } from '../services/salesMockService'
import {
  calculateEstimatedRevenue,
  calculateTotalCustomers,
} from '../utils/salesHelpers'

function useSalesSummary() {
  const totalCustomers = calculateTotalCustomers(salesBreakdown)
  const estimatedRevenue = calculateEstimatedRevenue(salesBreakdown)

  return {
    rows: salesBreakdown,
    totalCustomers,
    estimatedRevenue,
  }
}

export default useSalesSummary
