export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'DB' },
  {
    label: 'Branches',
    path: '/branches',
    icon: 'BR',
    children: [
      { label: 'Branches', path: '/branches' },
      { label: 'User', path: '/branches/users' },
    ],
  },
  { label: 'Employees', path: '/employees', icon: 'EM' },
  { label: 'Inventory', path: '/inventory', icon: 'IN' },
  { label: 'Sales', path: '/sales', icon: 'SL' },
  { label: 'Attendance', path: '/attendance', icon: 'AT' },
  { label: 'Feedback', path: '/feedback', icon: 'FB' },
  { label: 'Incident Reports', path: '/incidents', icon: 'IR' },
  { label: 'NTE Monitoring', path: '/nte', icon: 'NT' },
  { label: 'Plantilla', path: '/plantilla', icon: 'PL' },
  { label: 'Contributions', path: '/contributions', icon: 'CT' },
  { label: 'Leaves', path: '/leaves', icon: 'LV' },
  { label: 'Reports', path: '/reports', icon: 'RP' },
]
