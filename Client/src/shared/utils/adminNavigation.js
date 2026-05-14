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
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Inventory", hint: "Stocks and items", to: "/admin/inventory" },
      { label: "Sales Summary", hint: "Daily and monthly totals", to: "/admin/sales/summary" },
      { label: "Sales Input", hint: "Record buffet sales", to: "/admin/sales/input" },
      { label: "Recorded Sales", hint: "Sales table and filters", to: "/admin/sales/records" },
      { label: "Feedback", hint: "Customer ratings", to: "/admin/feedback" },
    ],
  },
];
