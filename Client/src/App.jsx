import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './features/shared/components/Navbar'
import Sidebar from './features/shared/components/Sidebar'
import LoginPage from './features/auth/pages/LoginPage'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import InventoryPage from './features/inventory/pages/InventoryPage'
import SalesPage from './features/sales/pages/SalesPage'
import EmployeesPage from './features/employees/pages/EmployeesPage'
import AttendancePage from './features/attendance/pages/AttendancePage'
import PayrollPage from './features/payroll/pages/PayrollPage'
import LeavesPage from './features/leaves/pages/LeavesPage'
import ContributionsPage from './features/contributions/pages/ContributionsPage'
import IncidentsPage from './features/incidents/pages/IncidentsPage'
import NtePage from './features/nte/pages/NtePage'
import ReportsPage from './features/reports/pages/ReportsPage'
import SettingsPage from './features/settings/pages/SettingsPage'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      <div className="main-shell">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main className="page-content">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/leaves" element={<LeavesPage />} />
            <Route path="/contributions" element={<ContributionsPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/nte" element={<NtePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  )
}

export default App
