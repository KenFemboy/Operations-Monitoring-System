import { useEffect, useState } from "react";

import {
  getOverallSummary,
  getSalesAnalytics,
  getEmployeeAnalytics,
  getAttendancePayrollAnalytics,
  getInventoryAnalytics,
  getFeedbackAnalytics,
  getIRNTEAnalytics,
  getLeavePlantillaAnalytics,
} from "../api/dashboardApi";

import StatCard from "../components/StatCard";
import DashboardSection from "../components/DashboardSection";
import SimpleBar from "../components/SimpleBar";
import SectionLoader from "../components/SectionLoader";

function Dashboard() {
  const [overall, setOverall] = useState(null);
  const [sales, setSales] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [attendancePayroll, setAttendancePayroll] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [irNte, setIrNte] = useState(null);
  const [leavePlantilla, setLeavePlantilla] = useState(null);

  const [currentLoading, setCurrentLoading] = useState("");
  const [error, setError] = useState("");

  const formatPeso = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
  };

  const formatRating = (value) => {
    return Number(value || 0).toFixed(1);
  };

  const loadDashboardOneByOne = async () => {
    try {
      setError("");

      setOverall(null);
      setSales(null);
      setEmployees(null);
      setAttendancePayroll(null);
      setInventory(null);
      setFeedback(null);
      setIrNte(null);
      setLeavePlantilla(null);

      setCurrentLoading("overall");
      const overallRes = await getOverallSummary();
      setOverall(overallRes.data.data);

      setCurrentLoading("sales");
      const salesRes = await getSalesAnalytics();
      setSales(salesRes.data.data);

      setCurrentLoading("employees");
      const employeesRes = await getEmployeeAnalytics();
      setEmployees(employeesRes.data.data);

      setCurrentLoading("attendancePayroll");
      const attendancePayrollRes = await getAttendancePayrollAnalytics();
      setAttendancePayroll(attendancePayrollRes.data.data);

      setCurrentLoading("inventory");
      const inventoryRes = await getInventoryAnalytics();
      setInventory(inventoryRes.data.data);

      setCurrentLoading("feedback");
      const feedbackRes = await getFeedbackAnalytics();
      setFeedback(feedbackRes.data.data);

      setCurrentLoading("irNte");
      const irNteRes = await getIRNTEAnalytics();
      setIrNte(irNteRes.data.data);

      setCurrentLoading("leavePlantilla");
      const leavePlantillaRes = await getLeavePlantillaAnalytics();
      setLeavePlantilla(leavePlantillaRes.data.data);

      setCurrentLoading("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard analytics");
      setCurrentLoading("");
    }
  };

  useEffect(() => {
    loadDashboardOneByOne();
  }, []);

  const employeeMax = employees?.total || 1;
  const payrollMax = attendancePayroll?.payroll?.total || 1;
  const irMax = irNte?.incidentReports?.total || 1;
  const nteMax = irNte?.nte?.total || 1;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard Analytics Report</h1>
          <p style={styles.subtitle}>
            Section-by-section analytics report for the business system.
          </p>
          {currentLoading && (
            <p style={styles.loadingText}>
              Loading {currentLoading} section...
            </p>
          )}
        </div>

        <button onClick={loadDashboardOneByOne} style={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Overall Summary */}
      {overall ? (
        <DashboardSection title="Overall Summary">
          <div style={styles.grid}>
            <StatCard
              title="Monthly Sales"
              value={formatPeso(overall.monthlySales)}
              subtitle={`${overall.monthlyCustomers} customers this month`}
              tone="green"
            />

            <StatCard
              title="Total Employees"
              value={overall.totalEmployees}
              subtitle={`${overall.activeEmployees} active employees`}
              tone="blue"
            />

            <StatCard
              title="Products"
              value={overall.totalProducts}
              subtitle={`${overall.lowStockProducts} low stock items`}
              tone="purple"
            />

            <StatCard
              title="Average Rating"
              value={`${formatRating(overall.averageRating)} ★`}
              subtitle={`${overall.totalFeedback} total reviews`}
              tone="yellow"
            />
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="Overall Summary" />
      )}

      {/* Sales */}
      {sales ? (
        <DashboardSection title="Sales Report">
          <div style={styles.grid}>
            <StatCard
              title="Monthly Total Sales"
              value={formatPeso(sales.monthlyTotal)}
              subtitle="Total buffet sales this month"
              tone="green"
            />

            <StatCard
              title="Monthly Customers"
              value={sales.monthlyCustomers}
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
                {sales.dailySales.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan="3">
                      No sales today.
                    </td>
                  </tr>
                ) : (
                  sales.dailySales.map((item) => (
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
      ) : (
        <SectionLoader title="Sales Report" />
      )}

      {/* Employees */}
      {employees ? (
        <DashboardSection title="Employee Status Report">
          <div style={styles.twoColumn}>
            <div>
              <SimpleBar
                label="Active"
                value={employees.active}
                max={employeeMax}
                color="#16a34a"
              />

              <SimpleBar
                label="Inactive"
                value={employees.inactive}
                max={employeeMax}
                color="#ca8a04"
              />

              <SimpleBar
                label="Resigned"
                value={employees.resigned}
                max={employeeMax}
                color="#6b7280"
              />

              <SimpleBar
                label="Terminated"
                value={employees.terminated}
                max={employeeMax}
                color="#dc2626"
              />
            </div>

            <div style={styles.grid}>
              <StatCard
                title="Total Employees"
                value={employees.total}
                tone="blue"
              />

              <StatCard
                title="Active Employees"
                value={employees.active}
                tone="green"
              />
            </div>
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="Employee Status Report" />
      )}

      {/* Attendance and Payroll */}
      {attendancePayroll ? (
        <DashboardSection title="Attendance and Payroll Report">
          <div style={styles.grid}>
            <StatCard
              title="Attendance Records"
              value={attendancePayroll.attendance.totalRecords}
              subtitle={`${attendancePayroll.attendance.todayRecords} records today`}
              tone="blue"
            />

            <StatCard
              title="Payroll Records"
              value={attendancePayroll.payroll.total}
              subtitle={`${attendancePayroll.payroll.done} done, ${attendancePayroll.payroll.pending} pending`}
              tone="purple"
            />

            <StatCard
              title="Contributions"
              value={attendancePayroll.contributions.total}
              subtitle="SSS, Pag-IBIG, PhilHealth records"
              tone="green"
            />
          </div>

          <h3 style={styles.smallHeading}>Payroll Completion</h3>

          <SimpleBar
            label="Done"
            value={attendancePayroll.payroll.done}
            max={payrollMax}
            color="#16a34a"
          />

          <SimpleBar
            label="Pending"
            value={attendancePayroll.payroll.pending}
            max={payrollMax}
            color="#ca8a04"
          />
        </DashboardSection>
      ) : (
        <SectionLoader title="Attendance and Payroll Report" />
      )}

      {/* Inventory */}
      {inventory ? (
        <DashboardSection title="Inventory Report">
          <div style={styles.grid}>
            <StatCard
              title="Total Products"
              value={inventory.products}
              subtitle="Registered products"
              tone="blue"
            />

            <StatCard
              title="Low Stock"
              value={inventory.lowStock}
              subtitle="Products below minimum stock"
              tone="yellow"
            />

            <StatCard
              title="Out of Stock"
              value={inventory.outOfStock}
              subtitle="Products with zero stock"
              tone="red"
            />

            <StatCard
              title="Pending Purchases"
              value={inventory.pendingPurchases}
              subtitle={`${inventory.purchases} total purchases`}
              tone="purple"
            />

            <StatCard
              title="Stock In Records"
              value={inventory.stockIn}
              tone="green"
            />

            <StatCard
              title="Stock Out Records"
              value={inventory.stockOut}
              tone="red"
            />
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="Inventory Report" />
      )}

      {/* Feedback */}
      {feedback ? (
        <DashboardSection title="Customer Feedback Report">
          <div style={styles.grid}>
            <StatCard
              title="Total Reviews"
              value={feedback.totalFeedback}
              subtitle="Customer feedback submitted"
              tone="blue"
            />

            <StatCard
              title="Average Rating"
              value={`${formatRating(feedback.averageRating)} ★`}
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
                {feedback.byBranch.length === 0 ? (
                  <tr>
                    <td style={styles.td} colSpan="3">
                      No branch reviews found.
                    </td>
                  </tr>
                ) : (
                  feedback.byBranch.map((branch) => (
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
      ) : (
        <SectionLoader title="Customer Feedback Report" />
      )}

      {/* IR and NTE */}
      {irNte ? (
        <DashboardSection title="IR and NTE Monitoring Report">
          <div style={styles.twoColumn}>
            <div>
              <h3 style={styles.smallHeading}>Incident Reports</h3>

              <SimpleBar
                label="Open"
                value={irNte.incidentReports.open}
                max={irMax}
                color="#dc2626"
              />

              <SimpleBar
                label="Resolved"
                value={irNte.incidentReports.resolved}
                max={irMax}
                color="#16a34a"
              />
            </div>

            <div>
              <h3 style={styles.smallHeading}>Notice to Explain</h3>

              <SimpleBar
                label="Pending"
                value={irNte.nte.pending}
                max={nteMax}
                color="#ca8a04"
              />

              <SimpleBar
                label="Answered"
                value={irNte.nte.answered}
                max={nteMax}
                color="#16a34a"
              />
            </div>
          </div>

          <div style={styles.grid}>
            <StatCard
              title="Total IR"
              value={irNte.incidentReports.total}
              tone="red"
            />

            <StatCard
              title="Total NTE"
              value={irNte.nte.total}
              tone="yellow"
            />
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="IR and NTE Monitoring Report" />
      )}

      {/* Leave and Plantilla */}
      {leavePlantilla ? (
        <DashboardSection title="Leave and Plantilla Report">
          <div style={styles.grid}>
            <StatCard
              title="Leave Records"
              value={leavePlantilla.leaves.total}
              subtitle={`${leavePlantilla.leaves.approved} approved, ${leavePlantilla.leaves.pending} pending`}
              tone="blue"
            />

            <StatCard
              title="Plantilla Records"
              value={leavePlantilla.plantilla.total}
              subtitle={`${leavePlantilla.plantilla.open} open, ${leavePlantilla.plantilla.filled} filled`}
              tone="purple"
            />

            <StatCard
              title="Understaffed"
              value={leavePlantilla.plantilla.understaffed}
              subtitle="Positions needing more employees"
              tone="yellow"
            />

            <StatCard
              title="Overstaffed"
              value={leavePlantilla.plantilla.overstaffed}
              subtitle="Positions with extra employees"
              tone="red"
            />
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="Leave and Plantilla Report" />
      )}
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

  loadingText: {
    marginTop: "8px",
    color: "#2563eb",
    fontWeight: "bold",
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