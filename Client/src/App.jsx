import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './features/shared/components/Navbar'
import Sidebar from './features/shared/components/Sidebar'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import AttendancePage from './features/attendance/pages/AttendancePage'
import EmployeesPage from './features/employees/pages/EmployeesPage'
import PayrollPage from './features/payroll/pages/PayrollPage'
import BranchesPage from './features/branches/pages/BranchesPage'
import BranchDetailsPage from './features/branches/pages/BranchDetailsPage'
import FeedbackPage from './features/feedback/pages/FeedbackPage'
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
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/branches/:branchId" element={<BranchDetailsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return <AppLayout />
}

export default App
