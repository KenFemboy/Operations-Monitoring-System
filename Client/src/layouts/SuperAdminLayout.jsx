import DashboardLayout from "./DashboardLayout";
import { superAdminNavigation } from "../shared/utils/superAdminNavigation";

export default function SuperAdminLayout(props) {
  return <DashboardLayout {...props} navGroups={superAdminNavigation} />;
}
