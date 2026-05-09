// Branch-level admin routes.
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AdminDashboardPage from "../../roles/admin/dashboard/AdminDashboardPage";
import AdminEmployeesPage from "../../roles/admin/employees/AdminEmployeesPage";
import AdminInventoryPage from "../../roles/admin/inventory/AdminInventoryPage";
import AdminSalesPage from "../../roles/admin/sales/AdminSalesPage";
import AdminFeedbackPage from "../../roles/admin/feedback/AdminFeedbackPage";
import AdminPlantillaPage from "../../roles/admin/plantilla/AdminPlantillaPage";
import AdminSettingsPage from "../../roles/admin/settings/AdminSettingsPage";
import AdminArchivePage from "../../roles/admin/settings/AdminArchivePage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="employees" element={<AdminEmployeesPage />} />
        <Route path="attendance" element={<AdminEmployeesPage initialTab="attendance" />} />
        <Route path="leave" element={<AdminEmployeesPage initialTab="leave" />} />
        <Route path="payroll" element={<AdminEmployeesPage initialTab="payroll" />} />
        <Route path="contributions" element={<AdminEmployeesPage initialTab="contribution" />} />
        <Route path="incident-reports" element={<AdminEmployeesPage initialTab="ir" />} />
        <Route path="nte" element={<AdminEmployeesPage initialTab="nte" />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="sales" element={<AdminSalesPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="plantilla" element={<AdminPlantillaPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="archive" element={<AdminArchivePage />} />
      </Route>
    </Routes>
  );
}
