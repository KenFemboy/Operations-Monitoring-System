import { useEffect, useMemo, useState } from 'react'
import Card from '../../shared/components/Card'
import { useBranchContext } from '../../shared/store/branchContext'
import useSalesSummary from '../../sales/hooks/useSalesSummary'
import useInventory from '../../inventory/hooks/useInventory'
import useAttendance from '../../attendance/hooks/useAttendance'
import { employeesService } from '../../employees/services/employeesService'

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value || 0)

function AdminDashboardPage() {
  const { activeBranch, displayBranchName } = useBranchContext()
  const inventoryRows = useInventory()
  const attendanceRows = useAttendance()
  const { dailySales } = useSalesSummary()
  const [employeesCount, setEmployeesCount] = useState(0)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeData = await employeesService.getAll()
        const filteredEmployees = employeeData.filter((employee) => {
          const assignedBranchName = employee.assignedBranchId?.branchName || ''
          return assignedBranchName.trim().toLowerCase() === activeBranch.trim().toLowerCase()
        })

        setEmployeesCount(filteredEmployees.length)
      } catch {
        setEmployeesCount(0)
      }
    }

    loadEmployees()
  }, [activeBranch])

  const recentActivityRows = useMemo(() => {
    return [...attendanceRows].sort((a, b) => b.id - a.id).slice(0, 5)
  }, [attendanceRows])

  return (
    <section>
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Branch overview for {displayBranchName || activeBranch}</p>
      </header>

      <section className="grid-4" style={{ marginBottom: '1rem' }}>
        <Card title="Total Employees" value={employeesCount} />
        <Card title="Daily Sales" value={formatCurrency(dailySales)} />
        <Card title="Inventory Count" value={inventoryRows.length} />
        <Card title="Recent Activity" value={recentActivityRows.length} />
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Recent Activity</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivityRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.employeeName}</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}

export default AdminDashboardPage
