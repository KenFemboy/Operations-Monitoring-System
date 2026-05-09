// Global superadmin routes.
import { Navigate, Route, Routes } from "react-router-dom";
import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import SuperAdminDashboardPage from "../../roles/superadmin/dashboard/SuperAdminDashboardPage";
import SuperAdminBranchesPage from "../../roles/superadmin/branches/SuperAdminBranchesPage";
import SuperAdminUsersPage from "../../roles/superadmin/users/SuperAdminUsersPage";
import SuperAdminEmployeesPage from "../../roles/superadmin/employees/SuperAdminEmployeesPage";
import SuperAdminInventoryPage from "../../roles/superadmin/inventory/SuperAdminInventoryPage";
import SuperAdminSalesPage from "../../roles/superadmin/sales/SuperAdminSalesPage";
import SuperAdminFeedbackPage from "../../roles/superadmin/feedback/SuperAdminFeedbackPage";
import SuperAdminReportsPage from "../../roles/superadmin/reports/SuperAdminReportsPage";
import SuperAdminPlantillaPage from "../../roles/superadmin/plantilla/SuperAdminPlantillaPage";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboardPage />} />
        <Route path="branches" element={<SuperAdminBranchesPage />} />
        <Route path="users" element={<SuperAdminUsersPage />} />
        <Route path="employees" element={<SuperAdminEmployeesPage />} />
        <Route path="attendance" element={<SuperAdminEmployeesPage initialTab="attendance" />} />
        <Route path="leave" element={<SuperAdminEmployeesPage initialTab="leave" />} />
        <Route path="payroll" element={<SuperAdminEmployeesPage initialTab="payroll" />} />
        <Route path="contributions" element={<SuperAdminEmployeesPage initialTab="contribution" />} />
        <Route path="incident-reports" element={<SuperAdminEmployeesPage initialTab="ir" />} />
        <Route path="nte" element={<SuperAdminEmployeesPage initialTab="nte" />} />
        <Route path="inventory" element={<SuperAdminInventoryPage />} />
        <Route path="sales" element={<SuperAdminSalesPage />} />
        <Route path="feedback" element={<SuperAdminFeedbackPage />} />
        <Route path="plantilla" element={<SuperAdminPlantillaPage />} />
        <Route path="reports" element={<SuperAdminReportsPage />} />
      </Route>
    </Routes>
  );
}
