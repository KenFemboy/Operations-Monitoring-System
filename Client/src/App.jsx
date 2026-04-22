import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './features/shared/components/Navbar'
import Sidebar from './features/shared/components/Sidebar'
import DashboardPage from './features/dashboard/pages/DashboardPage'
import AttendancePage from './features/attendance/pages/AttendancePage'
import EmployeesPage from './features/employees/pages/EmployeesPage'
import BranchesPage from './features/branches/pages/BranchesPage'
import InventoryPage from './features/inventory/pages/InventoryPage'
import SalesPage from './features/sales/pages/SalesPage'
import FeedbackPage from './features/feedback/pages/FeedbackPage'
import IncidentsPage from './features/incidents/pages/IncidentsPage'
import NtePage from './features/nte/pages/NtePage'
import PlantillaPage from './features/plantilla/pages/PlantillaPage'
import ContributionsPage from './features/contributions/pages/ContributionsPage'
import LeavesPage from './features/leaves/pages/LeavesPage'
import ReportsPage from './features/reports/pages/ReportsPage'
import DepartmentsPage from './features/departments/pages/DepartmentsPage'
import PositionsPage from './features/positions/pages/PositionsPage'
import { BranchProvider, useBranchContext } from './features/shared/store/branchContext'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { activeBranch } = useBranchContext()
  const branchThemeClass = `theme-${activeBranch.toLowerCase().replace(/\s+/g, '-')}`

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className={`app-shell ${branchThemeClass}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      <div className="main-shell">
        <Navbar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main className="page-content" key={`${location.pathname}-${activeBranch}`}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/nte" element={<NtePage />} />
            <Route path="/plantilla" element={<PlantillaPage />} />
            <Route path="/contributions" element={<ContributionsPage />} />
            <Route path="/leaves" element={<LeavesPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BranchProvider>
      <AppLayout />
    </BranchProvider>
  )
}

export default App
