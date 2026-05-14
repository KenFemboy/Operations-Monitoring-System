import { useEffect, useState } from "react";

import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../../../api/superadmin/superAdminBranchApi";
import { getEmployees } from "../../../api/admin/adminEmployeeApi";
import { getAttendance } from "../../../api/admin/adminAttendanceApi";
import { getPayrolls } from "../../../api/admin/adminPayrollApi";
import { getLeaves } from "../../../api/admin/adminLeaveApi";
import { getContributions } from "../../../api/admin/adminContributionApi";
import { getIncidentReports } from "../../../api/admin/adminIncidentReportApi";
import { getNTEs } from "../../../api/admin/adminNteApi";

import BranchForm from "../../../features/branches/components/BranchForm";
import BranchTable from "../../../features/branches/components/BranchTable";

const EMPTY_BRANCH_DATA = {
  employees: [],
  attendance: [],
  payrolls: [],
  leaves: [],
  contributions: [],
  incidentReports: [],
  ntes: [],
};

const TABS = [
  { key: "employees", label: "Employees" },
  { key: "attendance", label: "Attendance" },
  { key: "payrolls", label: "Payroll" },
  { key: "leaves", label: "Leaves" },
  { key: "contributions", label: "Contributions" },
  { key: "incidentReports", label: "IR" },
  { key: "ntes", label: "NTE" },
];

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
};

const getEmployeeName = (employee) => {
  if (!employee) return "-";
  return [employee.firstName, employee.lastName].filter(Boolean).join(" ") || "-";
};

function BranchPage() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [viewBranch, setViewBranch] = useState(null);
  const [activeTab, setActiveTab] = useState("employees");
  const [branchData, setBranchData] = useState(EMPTY_BRANCH_DATA);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await getBranches();
      setBranches(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranchRecords = async (branch) => {
    if (!branch?._id) return;

    try {
      setRecordsLoading(true);
      const params = { branchId: branch._id };
      const [
        employeesRes,
        attendanceRes,
        payrollRes,
        leaveRes,
        contributionRes,
        incidentReportRes,
        nteRes,
      ] = await Promise.all([
        getEmployees(params),
        getAttendance(params),
        getPayrolls(params),
        getLeaves(params),
        getContributions(params),
        getIncidentReports(params),
        getNTEs(params),
      ]);

      setBranchData({
        employees: employeesRes.data.data || [],
        attendance: attendanceRes.data.data || [],
        payrolls: payrollRes.data.data || [],
        leaves: leaveRes.data.data || [],
        contributions: contributionRes.data.data || [],
        incidentReports: incidentReportRes.data.data || [],
        ntes: nteRes.data.data || [],
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load branch records");
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleViewBranch = async (branch) => {
    setViewBranch(branch);
    setActiveTab("employees");
    setBranchData(EMPTY_BRANCH_DATA);
    await fetchBranchRecords(branch);
  };

  const handleBackToBranches = () => {
    setViewBranch(null);
    setBranchData(EMPTY_BRANCH_DATA);
    setActiveTab("employees");
  };

  const handleSubmit = async (form) => {
    try {
      if (selectedBranch) {
        await updateBranch(selectedBranch._id, form);
        alert("Branch updated successfully");
      } else {
        await createBranch(form);
        alert("Branch created successfully");
      }

      setSelectedBranch(null);
      fetchBranches();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save branch");
    }
  };

  const handleDelete = async (id, authorizationPassword) => {
    try {
      await deleteBranch(id, { authorizationPassword });
      alert("Branch deleted successfully");

      if (viewBranch?._id === id) {
        handleBackToBranches();
      }

      fetchBranches();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete branch");
    }
  };

  return (
    <div style={styles.page}>
      <h1>Branch Management</h1>
      <p>
        Select a branch to view its employees, attendance, payroll, leaves,
        contributions, IR, and NTE records.
      </p>

      {loading && <p>Loading branches...</p>}

      {viewBranch ? (
        <BranchRecordsView
          branch={viewBranch}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          branchData={branchData}
          loading={recordsLoading}
          onBack={handleBackToBranches}
          onRefresh={() => fetchBranchRecords(viewBranch)}
        />
      ) : (
        <>
          <BranchForm
            selectedBranch={selectedBranch}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedBranch(null)}
          />

          <BranchTable
            branches={branches}
            onView={handleViewBranch}
            onEdit={setSelectedBranch}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}

function BranchRecordsView({
  branch,
  activeTab,
  setActiveTab,
  branchData,
  loading,
  onBack,
  onRefresh,
}) {
  return (
    <section style={styles.recordsCard}>
      <div style={styles.selectedBranchBar}>
        <div>
          <strong>{branch.branchName}</strong>
          <span>{branch.location || "No location"}</span>
          <small>{branch.address || "No address"}</small>
        </div>

        <div style={styles.actions}>
          <button type="button" onClick={onRefresh} style={styles.secondaryButton}>
            Refresh
          </button>
          <button type="button" onClick={onBack} style={styles.secondaryButton}>
            Back to Branches
          </button>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? styles.activeSummary : styles.summary}
          >
            <strong>{branchData[tab.key]?.length || 0}</strong>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div style={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? styles.activeTab : styles.tab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? <p>Loading branch records...</p> : renderBranchTable(activeTab, branchData)}
    </section>
  );
}

const renderBranchTable = (activeTab, branchData) => {
  if (activeTab === "employees") {
    return (
      <DataTable
        columns={["Employee ID", "Name", "Position", "Status", "Date Hired"]}
        rows={branchData.employees.map((employee) => [
          employee.employeeId || "-",
          getEmployeeName(employee),
          employee.position || "-",
          employee.employmentStatus || "-",
          formatDate(employee.dateHired),
        ])}
      />
    );
  }

  if (activeTab === "attendance") {
    return (
      <DataTable
        columns={["Date", "Employee", "Status", "Time In", "Time Out"]}
        rows={branchData.attendance.map((record) => [
          formatDate(record.date),
          getEmployeeName(record.employee),
          record.status || "-",
          record.timeIn || "-",
          record.timeOut || "-",
        ])}
      />
    );
  }

  if (activeTab === "payrolls") {
    return (
      <DataTable
        columns={["Employee", "Period", "Daily Rate", "Net Pay", "Status"]}
        rows={branchData.payrolls.map((payroll) => [
          getEmployeeName(payroll.employee),
          `${formatDate(payroll.payPeriodStart)} - ${formatDate(payroll.payPeriodEnd)}`,
          payroll.dailyRate ?? payroll.hourlyRate ?? "-",
          payroll.netPay ?? "-",
          payroll.status || "-",
        ])}
      />
    );
  }

  if (activeTab === "leaves") {
    return (
      <DataTable
        columns={["Employee", "Type", "Dates", "Reason", "Status"]}
        rows={branchData.leaves.map((leave) => [
          getEmployeeName(leave.employee),
          leave.leaveType || "-",
          `${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`,
          leave.reason || leave.description || "-",
          leave.status || "-",
        ])}
      />
    );
  }

  if (activeTab === "contributions") {
    return (
      <DataTable
        columns={["Employee", "Month", "SSS", "PhilHealth", "Pag-IBIG", "Total"]}
        rows={branchData.contributions.map((contribution) => [
          getEmployeeName(contribution.employee),
          contribution.month || "-",
          contribution.sss ?? "-",
          contribution.philhealth ?? "-",
          contribution.pagibig ?? "-",
          contribution.totalContribution ?? "-",
        ])}
      />
    );
  }

  if (activeTab === "incidentReports") {
    return (
      <DataTable
        columns={["Date", "Employee", "Incident", "Status"]}
        rows={branchData.incidentReports.map((report) => [
          formatDate(report.incidentDate || report.createdAt),
          getEmployeeName(report.employee),
          report.incidentType || report.title || report.description || "-",
          report.status || "-",
        ])}
      />
    );
  }

  return (
    <DataTable
      columns={["Date", "Employee", "Reason", "Status"]}
      rows={branchData.ntes.map((nte) => [
        formatDate(nte.createdAt),
        getEmployeeName(nte.employee),
        nte.reason || nte.violation || nte.description || "-",
        nte.status || "-",
      ])}
    />
  );
};

function DataTable({ columns, rows }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={styles.th}>
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={styles.empty}>
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={`${rowIndex}-${row.join("-")}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} style={styles.td}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  recordsCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
  },
  selectedBranchBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    padding: "10px 14px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "10px",
    margin: "16px 0",
  },
  summary: {
    display: "grid",
    gap: "4px",
    padding: "12px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  activeSummary: {
    display: "grid",
    gap: "4px",
    padding: "12px",
    border: "1px solid #2563eb",
    backgroundColor: "#eff6ff",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    margin: "20px 0",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
  activeTab: {
    padding: "10px 16px",
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "760px",
  },
  th: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f9fafb",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  empty: {
    padding: "20px",
    textAlign: "center",
  },
};

export default BranchPage;
