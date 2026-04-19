import SalesCards from '../components/SalesCards'
import useSalesSummary from '../hooks/useSalesSummary'
import { useBranchContext } from '../../shared/store/branchContext'

function SalesPage() {
  const {
    rows,
    dailySales,
    monthlySales,
    totalDailySales,
    totalCustomers,
    estimatedRevenue,
  } = useSalesSummary()
  const { activeBranch, isReadOnly } = useBranchContext()

  return (
    <section>
      <header className="page-header">
        <h1>Sales</h1>
        <p>Buffet customer count and estimated revenue overview for {activeBranch}</p>
        {isReadOnly ? <p className="readonly-label">View Only Mode</p> : null}
      </header>
      <SalesCards
        rows={rows}
        dailySales={dailySales}
        monthlySales={monthlySales}
        totalDailySales={totalDailySales}
        totalCustomers={totalCustomers}
        estimatedRevenue={estimatedRevenue}
      />
    </section>
  )
}

export default SalesPage
