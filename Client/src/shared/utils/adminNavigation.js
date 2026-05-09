export const adminNavigation = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", hint: "Performance snapshot", to: "/admin/dashboard" }],
  },
  {
    title: "HR",
    items: [
      { label: "Employees", hint: "Employee records", to: "/admin/employees" },
      { label: "Attendance", hint: "Daily time records", to: "/admin/attendance" },
      { label: "Payroll", hint: "Salary and compensation", to: "/admin/payroll" },
      { label: "Leaves", hint: "Leave applications", to: "/admin/leave" },
      { label: "Contributions", hint: "Government remittances", to: "/admin/contributions" },
      { label: "Incident Reports", hint: "Incident documentation", to: "/admin/incident-reports" },
      { label: "Notice to Explain", hint: "Disciplinary notices", to: "/admin/nte" },
      { label: "Plantilla", hint: "Role slots and salary basis", to: "/admin/plantilla" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", hint: "Stocks and items", to: "/admin/inventory" },
      { label: "Sales", hint: "Revenue and transactions", to: "/admin/sales" },
      { label: "Feedback", hint: "Customer ratings", to: "/admin/feedback" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", hint: "System preferences", to: "/admin/settings" },
      { label: "Archive", hint: "Deleted records", to: "/admin/archive" },
    ],
  },
];
