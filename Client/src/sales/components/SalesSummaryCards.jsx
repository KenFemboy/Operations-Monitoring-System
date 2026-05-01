function SalesSummaryCards({ dailySummary, monthlySummary }) {
  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <h3>Lunch Sales Today</h3>
        <p>Customers: {dailySummary?.lunch?.totalCustomers || 0}</p>
        <h2>₱{dailySummary?.lunch?.totalSales || 0}</h2>
      </div>

      <div style={styles.card}>
        <h3>Dinner Sales Today</h3>
        <p>Customers: {dailySummary?.dinner?.totalCustomers || 0}</p>
        <h2>₱{dailySummary?.dinner?.totalSales || 0}</h2>
      </div>

      <div style={styles.card}>
        <h3>Daily Total Sales</h3>
        <p>Lunch + Dinner</p>
        <h2>₱{dailySummary?.dailyTotal || 0}</h2>
      </div>

      <div style={styles.card}>
        <h3>Monthly Total Sales</h3>
        <p>Current Month</p>
        <h2>₱{monthlySummary?.monthlyTotal || 0}</h2>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
};

export default SalesSummaryCards;