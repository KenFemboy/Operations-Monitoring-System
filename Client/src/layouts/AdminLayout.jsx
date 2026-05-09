import DashboardLayout from "./DashboardLayout";
import { adminNavigation } from "../shared/utils/adminNavigation";

export default function AdminLayout(props) {
  return <DashboardLayout {...props} navGroups={adminNavigation} />;
}
