import SalesCards from '../components/SalesCards'
import useSalesSummary from '../hooks/useSalesSummary'

function SalesPage() {
  const { rows, totalCustomers, estimatedRevenue } = useSalesSummary()

  return (
    <section>
      <header className="page-header">
        <h1>Sales</h1>
        <p>Buffet customer count and estimated revenue overview</p>
      </header>
      <SalesCards
        rows={rows}
        totalCustomers={totalCustomers}
        estimatedRevenue={estimatedRevenue}
      />
    </section>
  )
}

export default SalesPage
