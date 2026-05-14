import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";

import {
  getEmployees,
  getEmployeeFullDetails,
  createEmployee,
  archiveEmployee,
  updateEmployee,
} from "../../../api/admin/adminEmployeeApi";
import { getAttendance, createAttendance } from "../../../api/admin/adminAttendanceApi";
import { getPayrolls, createPayroll, updatePayrollStatus } from "../../../api/admin/adminPayrollApi";
import { getLeaves, createLeave, updateLeave, updateLeaveStatus } from "../../../api/admin/adminLeaveApi";
import { getContributions, createContribution } from "../../../api/admin/adminContributionApi";
import {
  getIncidentReports,
  createIncidentReport,
  updateIncidentReportStatus,
} from "../../../api/admin/adminIncidentReportApi";
import { getNTEs, createNTE, updateNTEStatus } from "../../../api/admin/adminNteApi";
import { getBranches } from "../../../api/admin/adminBranchApi";

import PresentEmployeesCard from "../../../features/employees/components/PresentEmployeesCard";
import EmployeeForm from "../../../features/employees/components/EmployeeForm";
import EmployeeTable from "../../../features/employees/components/EmployeeTable";
import EmployeeDetails from "../../../features/employees/components/EmployeeDetails";
import AttendanceForm from "../../../features/employees/components/AttendanceForm";
import PayrollTable from "../../../features/employees/components/PayrollTable";
import LeaveForm from "../../../features/employees/components/LeaveForm";
import LeaveTable from "../../../features/employees/components/LeaveTable";
import PayrollForm from "../../../features/employees/components/PayrollForm";
import ContributionForm from "../../../features/employees/components/ContributionForm";
import ContributionTable from "../../../features/employees/components/ContributionTable";
import IncidentReportForm from "../../../features/employees/components/IncidentReportForm";
import IncidentReportTable from "../../../features/employees/components/IncidentReportTable";
import NTEForm from "../../../features/employees/components/NTEForm";
import NTEReportTable from "../../../features/employees/components/NTEReportTable";
import ArchiveConfirmModal from "../../../features/archive/components/ArchiveConfirmModal";

const TABS = [
  { key: "employees", label: "Employees" },
  { key: "attendance", label: "Attendance" },
  { key: "leave", label: "Leave" },
  { key: "payroll", label: "Payroll" },
  { key: "contribution", label: "Contributions" },
  { key: "ir", label: "IR" },
  { key: "nte", label: "NTE" },
];

const getToday = () => new Date().toISOString().split("T")[0];

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

function ModuleViewToggle({ activeView, formLabel, tableLabel, onShowForm, onShowTable }) {
  return (
    <div className="tab-row" role="tablist" aria-label={`${tableLabel} views`}>
      <button
        type="button"
        onClick={onShowForm}
        className={`tab-btn ${activeView === "form" ? "is-active" : ""}`}
        aria-pressed={activeView === "form"}
      >
        {formLabel}
      </button>
      <button
        type="button"
        onClick={onShowTable}
        className={`tab-btn ${activeView === "table" ? "is-active" : ""}`}
        aria-pressed={activeView === "table"}
      >
        {tableLabel}
      </button>
    </div>
  );
}

function EmployeesPage({ initialTab = "employees" }) {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [employeeView, setEmployeeView] = useState("table");

  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday);
  const [attendanceView, setAttendanceView] = useState("table");
  const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState("all");

  const [leaves, setLeaves] = useState([]);
  const [editingLeave, setEditingLeave] = useState(null);
  const [leaveView, setLeaveView] = useState("table");

  const [payrolls, setPayrolls] = useState([]);
  const [payrollView, setPayrollView] = useState("table");
  const [contributions, setContributions] = useState([]);
  const [contributionView, setContributionView] = useState("table");
  const [incidentReports, setIncidentReports] = useState([]);
  const [incidentReportView, setIncidentReportView] = useState("table");
  const [ntes, setNtes] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getEmployees();

      setEmployees(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async () => {
    try {
      const res = await getBranches();
      setBranches(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch branches");
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await getAttendance();
      setAttendance(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
  }, []);

  const fetchLeaves = useCallback(async () => {
    try {
      const res = await getLeaves();
      setLeaves(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch leaves");
    }
  }, []);

  const fetchPayrolls = useCallback(async () => {
    try {
      const res = await getPayrolls();
      setPayrolls(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch payrolls");
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const res = await getContributions();
      setContributions(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch contributions");
    }
  }, []);

  const fetchIncidentReports = useCallback(async () => {
    try {
      const res = await getIncidentReports();
      setIncidentReports(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch incident reports");
    }
  }, []);

  const fetchNTEs = useCallback(async () => {
    try {
      const res = await getNTEs();
      setNtes(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch NTE records");
    }
  }, []);

  const fetchPageData = useCallback(() => {
    fetchBranches();
    fetchEmployees();
    fetchAttendance();
    fetchLeaves();
    fetchPayrolls();
    fetchContributions();
    fetchIncidentReports();
    fetchNTEs();
  }, [
    fetchAttendance,
    fetchBranches,
    fetchContributions,
    fetchEmployees,
    fetchIncidentReports,
    fetchLeaves,
    fetchNTEs,
    fetchPayrolls,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchPageData, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchPageData]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setActiveTab(initialTab), 0);

    return () => window.clearTimeout(timeoutId);
  }, [initialTab]);

  const handleSetToday = () => {
    setSelectedDate(getToday());
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await getEmployeeFullDetails(id);
      setSelectedDetails(res.data.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load employee details");
    }
  };

  const handleSaveEmployee = async (formData) => {
    try {
      if (selectedEmployee) {
        await updateEmployee(selectedEmployee._id, formData);
        alert("Employee updated successfully");
      } else {
        await createEmployee(formData);
        alert("Employee added successfully");
      }

      setSelectedEmployee(null);
      setEmployeeView("table");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save employee"));
    }
  };

  const handleShowAddEmployee = () => {
    setSelectedEmployee(null);
    setSelectedDetails(null);
    setEmployeeView("form");
  };

  const handleShowEmployeeTable = () => {
    setSelectedEmployee(null);
    setEmployeeView("table");
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeView("form");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleArchiveEmployee = async (reason) => {
    try {
      await archiveEmployee(archiveTarget._id, reason);
      alert("Employee archived successfully");
      setArchiveTarget(null);
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to archive employee"));
    }
  };

  const handleUpdateEmployeeStatus = async (id, status) => {
    try {
      await updateEmployee(id, { employmentStatus: status });
      alert("Employee status updated");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update employee status"));
    }
  };

  const handleSubmitAttendance = async (data) => {
    try {
      await createAttendance(data);
      alert("Attendance saved");
      setAttendanceView("table");
      fetchAttendance();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save attendance"));
    }
  };

  const handleSubmitLeave = async (data) => {
    try {
      if (editingLeave) {
        await updateLeave(editingLeave._id, data);
        alert("Leave updated");
      } else {
        await createLeave(data);
        alert("Leave filed");
      }

      setEditingLeave(null);
      setLeaveView("table");
      fetchLeaves();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save leave"));
    }
  };

  const handleEditLeave = (leave) => {
    setEditingLeave(leave);
    setLeaveView("form");
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      alert("Leave status updated");
      fetchLeaves();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update leave status"));
    }
  };

  const handleSubmitPayroll = async (data) => {
    try {
      await createPayroll(data);
      alert("Payroll created");
      setPayrollView("table");
      fetchPayrolls();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to create payroll"));
    }
  };

  const handleUpdatePayrollStatus = async (id, status) => {
    try {
      await updatePayrollStatus(id, status);
      alert("Payroll status updated");
      fetchPayrolls();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update payroll status"));
    }
  };

  const handleSubmitContribution = async (data) => {
    try {
      await createContribution(data);
      alert("Contribution saved");
      setContributionView("table");
      fetchContributions();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save contribution"));
    }
  };

  const handleSubmitIncidentReport = async (data) => {
    try {
      await createIncidentReport(data);
      alert("Incident report saved");
      setIncidentReportView("table");
      fetchIncidentReports();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save incident report"));
    }
  };

  const handleUpdateIncidentStatus = async (id, status) => {
    try {
      await updateIncidentReportStatus(id, status);
      alert("Incident report status updated");
      fetchIncidentReports();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update incident report status"));
    }
  };

  const handleSubmitNTE = async (data) => {
    try {
      await createNTE(data);
      alert("NTE saved");
      fetchNTEs();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save NTE"));
    }
  };

  const handleUpdateNTEStatus = async (id, status) => {
    try {
      await updateNTEStatus(id, status);
      alert("NTE status updated");
      fetchNTEs();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to update NTE status"));
    }
  };

  return (
    <div className="employee-page">
      <header className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage staff records, attendance, and internal workflows.</p>
        </div>
      </header>

      <div className="tab-row" role="tablist" aria-label="Employee sections">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? "is-active" : ""}`}
            aria-pressed={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "employees" && (
        <div className="employee-tab-stack">
          <ModuleViewToggle
            activeView={employeeView}
            formLabel="Add Employee"
            tableLabel="Employee Table"
            onShowForm={handleShowAddEmployee}
            onShowTable={handleShowEmployeeTable}
          />

          {employeeView === "form" && (
            <EmployeeForm
              branches={branches}
              onSubmit={handleSaveEmployee}
              selectedEmployee={selectedEmployee}
              onCancelEdit={handleShowEmployeeTable}
            />
          )}

          {employeeView === "table" && (
            <div className="employee-list-panel">
              {loading ? (
                <p className="table-empty">Loading employees...</p>
              ) : (
                <>
                  <EmployeeTable
                    employees={employees}
                    onDelete={(id) =>
                      setArchiveTarget(employees.find((employee) => employee._id === id))
                    }
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateEmployeeStatus}
                    onEdit={handleEditEmployee}
                    canDelete
                  />

                  <EmployeeDetails
                    details={selectedDetails}
                    onClose={() => setSelectedDetails(null)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "attendance" && (
        <section className="attendance-page">
          {!isSuperAdmin && (
            <ModuleViewToggle
              activeView={attendanceView}
              formLabel="Add Attendance"
              tableLabel="Attendance Table"
              onShowForm={() => setAttendanceView("form")}
              onShowTable={() => setAttendanceView("table")}
            />
          )}

          {!isSuperAdmin && attendanceView === "form" && (
            <AttendanceForm employees={employees} onSubmit={handleSubmitAttendance} />
          )}

          {(isSuperAdmin || attendanceView === "table") && (
            <>
              <div className="attendance-filters">
                <div className="attendance-filter-field">
                  <label htmlFor="attendance-date">Calendar date</label>
                  <input
                    id="attendance-date"
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                  />
                </div>
                <div className="attendance-filter-field">
                  <label htmlFor="attendance-branch">Branch</label>
                  <select
                    id="attendance-branch"
                    value={selectedAttendanceBranch}
                    onChange={(event) => setSelectedAttendanceBranch(event.target.value)}
                  >
                    <option value="all">All Branches</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.branchName}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="attendance-clear-btn"
                  onClick={() => {
                    handleSetToday();
                    setSelectedAttendanceBranch("all");
                  }}
                >
                  Reset
                </button>
              </div>

              <PresentEmployeesCard
                attendance={attendance}
                selectedDate={selectedDate}
                selectedBranch={selectedAttendanceBranch}
              />
            </>
          )}
        </section>
      )}

      {activeTab === "leave" && (
        <div className="employee-tab-stack">
          <ModuleViewToggle
            activeView={leaveView}
            formLabel="Add Leave"
            tableLabel="Leave Table"
            onShowForm={() => {
              setEditingLeave(null);
              setLeaveView("form");
            }}
            onShowTable={() => {
              setEditingLeave(null);
              setLeaveView("table");
            }}
          />

          {leaveView === "form" && (
            <LeaveForm
              employees={employees}
              onSubmit={handleSubmitLeave}
              editingLeave={editingLeave}
              onCancelEdit={() => {
                setEditingLeave(null);
                setLeaveView("table");
              }}
            />
          )}

          {leaveView === "table" && (
            <LeaveTable
              leaves={leaves}
              onUpdateStatus={handleUpdateLeaveStatus}
              onEdit={handleEditLeave}
            />
          )}
        </div>
      )}

      {activeTab === "payroll" && (
        <div className="employee-tab-stack">
          <ModuleViewToggle
            activeView={payrollView}
            formLabel="Add Payroll"
            tableLabel="Payroll Table"
            onShowForm={() => setPayrollView("form")}
            onShowTable={() => setPayrollView("table")}
          />

          {payrollView === "form" && (
            <PayrollForm employees={employees} onSubmit={handleSubmitPayroll} />
          )}

          {payrollView === "table" && (
            <PayrollTable
              payrolls={payrolls}
              onUpdateStatus={handleUpdatePayrollStatus}
            />
          )}
        </div>
      )}

      {activeTab === "contribution" && (
        <div className="employee-tab-stack">
          <ModuleViewToggle
            activeView={contributionView}
            formLabel="Add Contribution"
            tableLabel="Contribution Table"
            onShowForm={() => setContributionView("form")}
            onShowTable={() => setContributionView("table")}
          />

          {contributionView === "form" && (
            <ContributionForm
              employees={employees}
              onSubmit={handleSubmitContribution}
            />
          )}

          {contributionView === "table" && (
            <ContributionTable contributions={contributions} />
          )}
        </div>
      )}

      {activeTab === "ir" && (
        <div className="employee-tab-stack">
          <ModuleViewToggle
            activeView={incidentReportView}
            formLabel="Add Incident Report"
            tableLabel="Incident Report Table"
            onShowForm={() => setIncidentReportView("form")}
            onShowTable={() => setIncidentReportView("table")}
          />

          {incidentReportView === "form" && (
            <IncidentReportForm
              employees={employees}
              onSubmit={handleSubmitIncidentReport}
            />
          )}

          {incidentReportView === "table" && (
            <IncidentReportTable
              reports={incidentReports}
              onUpdateStatus={handleUpdateIncidentStatus}
            />
          )}
        </div>
      )}

      {activeTab === "nte" && (
        <>
          {isSuperAdmin && (
            <NTEForm employees={employees} onSubmit={handleSubmitNTE} />
          )}

          <NTEReportTable
            ntes={ntes}
            onUpdateStatus={handleUpdateNTEStatus}
            canUpdateStatus={isSuperAdmin}
          />
        </>
      )}

      <ArchiveConfirmModal
        isOpen={Boolean(archiveTarget)}
        title="Archive employee"
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchiveEmployee}
      />
    </div>
  );
}

export default EmployeesPage;
