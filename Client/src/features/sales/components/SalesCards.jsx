import Card from '../../shared/components/Card'
import { formatCurrency } from '../utils/salesHelpers'

function SalesCards({
  rows,
  dailySales,
  monthlySales,
  totalDailySales,
  totalCustomers,
  estimatedRevenue,
}) {
  return (
    <>
      <div className="grid-4">
        {rows.map((row) => (
          <Card key={row.id} title={row.customerType} value={row.count} />
        ))}
      </div>
      <div className="grid-4">
        <Card title="Daily Sales" value={formatCurrency(dailySales)} />
        <Card title="Monthly Sales" value={formatCurrency(monthlySales)} />
        <Card title="Total Daily Sales" value={formatCurrency(totalDailySales)} />
      </div>
      <div className="grid-2">
        <Card title="Total Customers" value={totalCustomers} />
        <Card title="Estimated Revenue" value={formatCurrency(estimatedRevenue)} />
      </div>
    </>
  )
}

export default SalesCards
