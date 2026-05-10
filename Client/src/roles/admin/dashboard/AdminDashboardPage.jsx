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
} from "../../../api/admin/adminDashboardApi";

import StatCard from "../../../features/dashboard/components/StatCard";
import DashboardSection from "../../../features/dashboard/components/DashboardSection";
import SimpleBar from "../../../features/dashboard/components/SimpleBar";
import SectionLoader from "../../../features/dashboard/components/SectionLoader";
import "../../../features/dashboard/components/DashboardPage.css";

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
    return `PHP ${Number(value || 0).toLocaleString()}`;
  };

  const formatRating = (value) => {
    return Number(value || 0).toFixed(1);
  };

  const dashboardSections = [
    { label: "overall", request: getOverallSummary, setData: setOverall },
    { label: "sales", request: getSalesAnalytics, setData: setSales },
    { label: "employees", request: getEmployeeAnalytics, setData: setEmployees },
    {
      label: "attendance and payroll",
      request: getAttendancePayrollAnalytics,
      setData: setAttendancePayroll,
    },
    { label: "inventory", request: getInventoryAnalytics, setData: setInventory },
    { label: "feedback", request: getFeedbackAnalytics, setData: setFeedback },
    { label: "IR and NTE", request: getIRNTEAnalytics, setData: setIrNte },
    { label: "leave", request: getLeavePlantillaAnalytics, setData: setLeavePlantilla },
  ];

  const loadDashboardOneByOne = async () => {
    setError("");

    setOverall(null);
    setSales(null);
    setEmployees(null);
    setAttendancePayroll(null);
    setInventory(null);
    setFeedback(null);
    setIrNte(null);
    setLeavePlantilla(null);

    const failedSections = [];

    for (const section of dashboardSections) {
      try {
        setCurrentLoading(section.label);
        const response = await section.request();
        section.setData(response.data.data);
      } catch (err) {
        console.error(`Failed to load ${section.label} dashboard section`, err);
        failedSections.push(section.label);
      }
    }

    setCurrentLoading("");

    if (failedSections.length > 0) {
      setError(`Some dashboard sections failed to load: ${failedSections.join(", ")}`);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadDashboardOneByOne();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const employeeMax = employees?.total || 1;
  const payrollMax = attendancePayroll?.payroll?.total || 1;
  const irMax = irNte?.incidentReports?.total || 1;
  const nteMax = irNte?.nte?.total || 1;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard Analytics Report</h1>
            <p className="dashboard-subtitle">
              Section-by-section analytics report for the business system.
            </p>
            {currentLoading && (
              <p className="dashboard-loading">
                Loading {currentLoading} section...
              </p>
            )}
          </div>

          <button
            onClick={loadDashboardOneByOne}
            className="dashboard-refresh"
          >
            Refresh
          </button>
        </div>

        {error && <p className="dashboard-error">{error}</p>}

      {/* Overall Summary */}
      {overall ? (
        <DashboardSection title="Overall Summary">
          <div className="dashboard-grid">
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
              value={`${formatRating(overall.averageRating)} stars`}
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
          <div className="dashboard-grid">
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

          <h3 className="dashboard-heading">Today by Meal Type</h3>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="dashboard-th">Meal Type</th>
                  <th className="dashboard-th">Customers</th>
                  <th className="dashboard-th">Total Sales</th>
                </tr>
              </thead>

              <tbody>
                {(sales.dailySales || []).length === 0 ? (
                  <tr>
                    <td className="dashboard-td" colSpan="3">
                      No sales today.
                    </td>
                  </tr>
                ) : (
                  (sales.dailySales || []).map((item) => (
                    <tr key={item._id}>
                      <td className="dashboard-td">{item._id || "N/A"}</td>
                      <td className="dashboard-td">{item.totalCustomers}</td>
                      <td className="dashboard-td">{formatPeso(item.totalSales)}</td>
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
          <div className="dashboard-two-col">
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

            <div className="dashboard-grid">
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
          <div className="dashboard-grid">
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

          <h3 className="dashboard-heading">Payroll Completion</h3>

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
          <div className="dashboard-grid">
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
          <div className="dashboard-grid">
            <StatCard
              title="Total Reviews"
              value={feedback.totalFeedback}
              subtitle="Customer feedback submitted"
              tone="blue"
            />

            <StatCard
              title="Average Rating"
              value={`${formatRating(feedback.averageRating)} stars`}
              subtitle="Overall customer rating"
              tone="yellow"
            />
          </div>

          <h3 className="dashboard-heading">Average Rating by Branch</h3>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th className="dashboard-th">Branch</th>
                  <th className="dashboard-th">Average Rating</th>
                  <th className="dashboard-th">Reviews</th>
                </tr>
              </thead>

              <tbody>
                {(feedback.byBranch || []).length === 0 ? (
                  <tr>
                    <td className="dashboard-td" colSpan="3">
                      No branch reviews found.
                    </td>
                  </tr>
                ) : (
                  (feedback.byBranch || []).map((branch) => (
                    <tr key={branch.branchId || branch._id || branch.branchName}>
                      <td className="dashboard-td">
                        {branch.branchName || branch.branch || "No Branch"}
                      </td>
                      <td className="dashboard-td">
                        {formatRating(branch.averageRating)} stars
                      </td>
                      <td className="dashboard-td">{branch.totalFeedback}</td>
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
          <div className="dashboard-two-col">
            <div>
              <h3 className="dashboard-heading">Incident Reports</h3>

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
              <h3 className="dashboard-heading">Notice to Explain</h3>

              <SimpleBar
                label="Pending"
                value={irNte.nte.pending}
                max={nteMax}
                color="#ca8a04"
              />

              <SimpleBar
                label="Submitted"
                value={irNte.nte.submitted}
                max={nteMax}
                color="#16a34a"
              />
            </div>
          </div>

          <div className="dashboard-grid">
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

      {/* Leave */}
      {leavePlantilla ? (
        <DashboardSection title="Leave Report">
          <div className="dashboard-grid">
            <StatCard
              title="Leave Records"
              value={leavePlantilla.leaves.total}
              subtitle={`${leavePlantilla.leaves.approved} approved, ${leavePlantilla.leaves.pending} pending`}
              tone="blue"
            />
          </div>
        </DashboardSection>
      ) : (
        <SectionLoader title="Leave Report" />
      )}
      </div>
    </div>
  );
}

export default Dashboard;
