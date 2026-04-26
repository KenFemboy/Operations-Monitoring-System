export const navigationItems = [
  { label: 'Dashboard', path: '/app/dashboard', icon: 'DB' },
  { label: 'Reports', path: '/app/reports', icon: 'RP' },
  {
    label: 'Branch Management',
    path: '/app/branches',
    icon: 'BR',
    children: [
      { label: 'Branches', path: '/app/branches' },
      { label: 'Branch Users', path: '/app/branches/users' },
    ],
  },
  {
    label: 'HR',
    path: '/app/employees',
    icon: 'HR',
    children: [
      { label: 'Employees', path: '/app/employees' },
      { label: 'Plantilla', path: '/app/plantilla' },
      { label: 'Attendance', path: '/app/attendance' },
      { label: 'Leaves', path: '/app/leaves' },
    ],
  },
  {
    label: 'Operations',
    path: '/app/inventory',
    icon: 'OP',
    children: [
      { label: 'Inventory', path: '/app/inventory' },
      { label: 'Sales', path: '/app/sales' },
      { label: 'Feedback', path: '/app/feedback' },
    ],
  },
  {
    label: 'Finance',
    path: '/app/payroll',
    icon: 'FN',
    children: [
      { label: 'Payroll', path: '/app/payroll' },
      { label: 'Contributions', path: '/app/contributions' },
    ],
  },
  {
    label: 'Compliance',
    path: '/app/incidents',
    icon: 'CP',
    children: [
      { label: 'Incident Reports', path: '/app/incidents' },
      { label: 'NTE Monitoring', path: '/app/nte' },
    ],
  },
  { label: 'Settings', path: '/app/settings', icon: 'ST' },
]
