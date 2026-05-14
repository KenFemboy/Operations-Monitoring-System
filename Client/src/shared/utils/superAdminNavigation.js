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
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", hint: "Stocks and items", to: "/superadmin/inventory" },
      { label: "Sales Summary", hint: "Daily and monthly totals", to: "/superadmin/sales/summary" },
      { label: "Sales Input", hint: "Record branch sales", to: "/superadmin/sales/input" },
      { label: "Recorded Sales", hint: "Sales table and filters", to: "/superadmin/sales/records" },
      { label: "Feedback", hint: "Customer ratings", to: "/superadmin/feedback" },
    ],
  },
  {
    title: "Branch and Admin archived records",
    items: [
      {
        label: "Branch and Admin archived records",
        hint: "Deleted branches and admins",
        to: "/superadmin/adminArchive",
      },
      { label: "Archive", hint: "Archived records", to: "/superadmin/archive" },
    ],
  },
];
