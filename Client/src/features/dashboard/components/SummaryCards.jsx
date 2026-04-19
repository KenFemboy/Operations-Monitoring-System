import Card from '../../shared/components/Card'
import { formatCurrency } from '../utils/formatCurrency'

function SummaryCards({ summary }) {
  return (
    <div className="grid-4">
      <Card title="Total Branches" value={summary.totalBranches} />
      <Card title="Total Employees" value={summary.totalEmployees} />
      <Card title="Total Sales" value={formatCurrency(summary.totalSales)} />
      <Card title="Active Branches" value="2" />
    </div>
  )
}

export default SummaryCards
