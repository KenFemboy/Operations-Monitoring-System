export function calculateTotalCustomers(rows) {
  return rows.reduce((total, row) => total + row.count, 0)
}

export function calculateEstimatedRevenue(rows) {
  return rows.reduce((total, row) => total + row.count * row.rate, 0)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount)
}
