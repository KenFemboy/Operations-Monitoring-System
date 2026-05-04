import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../api/dashboardApi";
import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";
import SimpleBar from "../components/SimpleBar";

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getDashboardAnalytics();
      setAnalytics(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatPeso = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  const formatRating = (value) => {
    return Number(value || 0).toFixed(1);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>Dashboard Analytics</h1>
        <p>Loading analytics report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1>Dashboard Analytics</h1>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={styles.page}>
        <h1>Dashboard Analytics</h1>
        <p>No analytics data available.</p>
      </div>
    );
  }

  const employeeMax = analytics.employees.total || 1;
  const payrollMax = analytics.payroll.total || 1;
  const irMax = analytics.incidentReports.total || 1;
  const nteMax = analytics.nte.total || 1;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard Analytics Report</h1>
          <p style={styles.subtitle}>
            Overview of sales, employees, payroll, attendance, inventory,
            feedback, IR, NTE, leaves, and plantilla.
          </p>
        </div>

        <button onClick={fetchAnalytics} style={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {/* Main Summary */}
      <DashboardSection title="Overall Summary">
        <div style={styles.grid}>
          <StatCard
            title="Monthly Sales"
            value={formatPeso(analytics.sales.monthlyTotal)}
            subtitle={`${analytics.sales.monthlyCustomers} customers this month`}
            tone="green"
          />

          <StatCard
            title="Total Employees"
            value={analytics.employees.total}
            subtitle={`${analytics.employees.active} active employees`}
            tone="blue"
          />

          <StatCard
            title="Products"
            value={analytics.inventory.products}
            subtitle={`${analytics.inventory.lowStock} low stock items`}
            tone="purple"
          />

          <StatCard
            title="Average Rating"
            value={`${formatRating(analytics.feedback.averageRating)} ★`}
            subtitle={`${analytics.feedback.totalFeedback} total reviews`}
            tone="yellow"
          />
        </div>
      </DashboardSection>

      {/* Sales */}
      <DashboardSection title="Sales Report">
        <div style={styles.grid}>
          <StatCard
            title="Monthly Total Sales"
            value={formatPeso(analytics.sales.monthlyTotal)}
            subtitle="Total buffet sales this month"
            tone="green"
          />

          <StatCard
            title="Monthly Customers"
            value={analytics.sales.monthlyCustomers}
            subtitle="Total customers served this month"
            tone="blue"
          />
        </div>

        <h3 style={styles.smallHeading}>Today by Meal Type</h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Meal Type</th>
                <th style={styles.th}>Customers</th>
                <th style={styles.th}>Total Sales</th>
              </tr>
            </thead>

            <tbody>
              {analytics.sales.dailySales.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan="3">
                    No sales today.
                  </td>
                </tr>
              ) : (
                analytics.sales.dailySales.map((item) => (
                  <tr key={item._id}>
                    <td style={styles.td}>{item._id || "N/A"}</td>
                    <td style={styles.td}>{item.totalCustomers}</td>
                    <td style={styles.td}>{formatPeso(item.totalSales)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* Employees */}
      <DashboardSection title="Employee Status Report">
        <div style={styles.twoColumn}>
          <div>
            <SimpleBar
              label="Active"
              value={analytics.employees.active}
              max={employeeMax}
              color="#16a34a"
            />

            <SimpleBar
              label="Inactive"
              value={analytics.employees.inactive}
              max={employeeMax}
              color="#ca8a04"
            />

            <SimpleBar
              label="Resigned"
              value={analytics.employees.resigned}
              max={employeeMax}
              color="#6b7280"
            />

            <SimpleBar
              label="Terminated"
              value={analytics.employees.terminated}
              max={employeeMax}
              color="#dc2626"
            />
          </div>

          <div style={styles.grid}>
            <StatCard
              title="Total Employees"
              value={analytics.employees.total}
              tone="blue"
            />

            <StatCard
              title="Active Employees"
              value={analytics.employees.active}
              tone="green"
            />
          </div>
        </div>
      </DashboardSection>

      {/* Attendance and Payroll */}
      <DashboardSection title="Attendance and Payroll Report">
        <div style={styles.grid}>
          <StatCard
            title="Attendance Records"
            value={analytics.attendance.totalRecords}
            subtitle={`${analytics.attendance.todayRecords} records today`}
            tone="blue"
          />

          <StatCard
            title="Payroll Records"
            value={analytics.payroll.total}
            subtitle={`${analytics.payroll.done} done, ${analytics.payroll.pending} pending`}
            tone="purple"
          />

          <StatCard
            title="Contributions"
            value={analytics.contributions.total}
            subtitle="SSS, Pag-IBIG, PhilHealth records"
            tone="green"
          />
        </div>

        <h3 style={styles.smallHeading}>Payroll Completion</h3>

        <SimpleBar
          label="Done"
          value={analytics.payroll.done}
          max={payrollMax}
          color="#16a34a"
        />

        <SimpleBar
          label="Pending"
          value={analytics.payroll.pending}
          max={payrollMax}
          color="#ca8a04"
        />
      </DashboardSection>

      {/* Inventory */}
      <DashboardSection title="Inventory Report">
        <div style={styles.grid}>
          <StatCard
            title="Total Products"
            value={analytics.inventory.products}
            subtitle="Registered products"
            tone="blue"
          />

          <StatCard
            title="Low Stock"
            value={analytics.inventory.lowStock}
            subtitle="Products below minimum stock"
            tone="yellow"
          />

          <StatCard
            title="Out of Stock"
            value={analytics.inventory.outOfStock}
            subtitle="Products with zero stock"
            tone="red"
          />

          <StatCard
            title="Pending Purchases"
            value={analytics.inventory.pendingPurchases}
            subtitle={`${analytics.inventory.purchases} total purchases`}
            tone="purple"
          />

          <StatCard
            title="Stock In Records"
            value={analytics.inventory.stockIn}
            tone="green"
          />

          <StatCard
            title="Stock Out Records"
            value={analytics.inventory.stockOut}
            tone="red"
          />
        </div>
      </DashboardSection>

      {/* Feedback */}
      <DashboardSection title="Customer Feedback Report">
        <div style={styles.grid}>
          <StatCard
            title="Total Reviews"
            value={analytics.feedback.totalFeedback}
            subtitle="Customer feedback submitted"
            tone="blue"
          />

          <StatCard
            title="Average Rating"
            value={`${formatRating(analytics.feedback.averageRating)} ★`}
            subtitle="Overall customer rating"
            tone="yellow"
          />
        </div>

        <h3 style={styles.smallHeading}>Average Rating by Branch</h3>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Branch</th>
                <th style={styles.th}>Average Rating</th>
                <th style={styles.th}>Reviews</th>
              </tr>
            </thead>

            <tbody>
              {analytics.feedback.byBranch.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan="3">
                    No branch reviews found.
                  </td>
                </tr>
              ) : (
                analytics.feedback.byBranch.map((branch) => (
                  <tr key={branch._id}>
                    <td style={styles.td}>{branch._id || "No Branch"}</td>
                    <td style={styles.td}>
                      {formatRating(branch.averageRating)} ★
                    </td>
                    <td style={styles.td}>{branch.totalFeedback}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DashboardSection>

      {/* IR and NTE */}
      <DashboardSection title="IR and NTE Monitoring Report">
        <div style={styles.twoColumn}>
          <div>
            <h3 style={styles.smallHeading}>Incident Reports</h3>

            <SimpleBar
              label="Open"
              value={analytics.incidentReports.open}
              max={irMax}
              color="#dc2626"
            />

            <SimpleBar
              label="Resolved"
              value={analytics.incidentReports.resolved}
              max={irMax}
              color="#16a34a"
            />
          </div>

          <div>
            <h3 style={styles.smallHeading}>Notice to Explain</h3>

            <SimpleBar
              label="Pending"
              value={analytics.nte.pending}
              max={nteMax}
              color="#ca8a04"
            />

            <SimpleBar
              label="Answered"
              value={analytics.nte.answered}
              max={nteMax}
              color="#16a34a"
            />
          </div>
        </div>

        <div style={styles.grid}>
          <StatCard
            title="Total IR"
            value={analytics.incidentReports.total}
            tone="red"
          />

          <StatCard
            title="Total NTE"
            value={analytics.nte.total}
            tone="yellow"
          />
        </div>
      </DashboardSection>

      {/* Leave and Plantilla */}
      <DashboardSection title="Leave and Plantilla Report">
        <div style={styles.grid}>
          <StatCard
            title="Leave Records"
            value={analytics.leaves.total}
            subtitle={`${analytics.leaves.approved} approved, ${analytics.leaves.pending} pending`}
            tone="blue"
          />

          <StatCard
            title="Plantilla Records"
            value={analytics.plantilla.total}
            subtitle={`${analytics.plantilla.open} open, ${analytics.plantilla.filled} filled`}
            tone="purple"
          />

          <StatCard
            title="Understaffed"
            value={analytics.plantilla.understaffed}
            subtitle="Positions needing more employees"
            tone="yellow"
          />

          <StatCard
            title="Overstaffed"
            value={analytics.plantilla.overstaffed}
            subtitle="Positions with extra employees"
            tone="red"
          />
        </div>
      </DashboardSection>
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  refreshButton: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },

  smallHeading: {
    marginTop: "20px",
    marginBottom: "12px",
    color: "#374151",
    fontSize: "16px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "650px",
  },

  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },

  error: {
    color: "#dc2626",
    fontWeight: "bold",
  },
};

export default Dashboard;