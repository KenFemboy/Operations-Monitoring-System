import Table from '../../shared/components/Table'
import GeneratePayrollBar from '../components/GeneratePayrollBar'
import usePayroll from '../hooks/usePayroll'
import { payrollColumns } from '../utils/payrollColumns'

function PayrollPage() {
  const rows = usePayroll()

  return (
    <section>
      <header className="page-header">
        <h1>Payroll</h1>
        <p>Payroll records generated from local mock data</p>
      </header>
      <section className="table-card">
        <GeneratePayrollBar />
        <Table columns={payrollColumns} rows={rows} />
      </section>
    </section>
  )
}

export default PayrollPage
