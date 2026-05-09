export const superAdminNavigation = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", hint: "Performance snapshot", to: "/superadmin/dashboard" },
      { label: "Admin Users", hint: "Manage branch admins", to: "/superadmin/users" },
    ],
  },
  {
    title: "Branch Management",
    items: [{ label: "Branches", hint: "Locations and setup", to: "/superadmin/branches" }],
  },
  {
    title: "HR",
    items: [
      { label: "Employees", hint: "Employee records", to: "/superadmin/employees" },
      { label: "Attendance", hint: "Daily time records", to: "/superadmin/attendance" },
      { label: "Payroll", hint: "Salary and compensation", to: "/superadmin/payroll" },
      { label: "Leaves", hint: "Leave applications", to: "/superadmin/leave" },
      { label: "Contributions", hint: "Government remittances", to: "/superadmin/contributions" },
      { label: "Incident Reports", hint: "Incident documentation", to: "/superadmin/incident-reports" },
      { label: "Notice to Explain", hint: "Disciplinary notices", to: "/superadmin/nte" },
      { label: "Plantilla", hint: "Role slots and salary basis", to: "/superadmin/plantilla" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", hint: "Stocks and items", to: "/superadmin/inventory" },
      { label: "Sales", hint: "Revenue and transactions", to: "/superadmin/sales" },
      { label: "Feedback", hint: "Customer ratings", to: "/superadmin/feedback" },
    ],
  },
  {
    title: "Reports",
    items: [{ label: "Archive", hint: "Deleted records", to: "/superadmin/reports" }],
  },
];
