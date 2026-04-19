import Card from '../../shared/components/Card'
import { formatCurrency } from '../utils/formatCurrency'

function SummaryCards({ summary }) {
  return (
    <div className="grid-4">
      <Card title="Total Staff" value={summary.totalStaff} />
      <Card title="Daily Sales" value={formatCurrency(summary.dailySales)} />
      <Card title="Inventory Items" value={summary.inventoryItems} />
      <Card title="Active Shift" value="Lunch Service" />
    </div>
  )
}

export default SummaryCards
