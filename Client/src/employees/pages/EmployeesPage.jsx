import { useCallback, useEffect, useState } from "react";

import {
  getEmployees,
  getEmployeeFullDetails,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  createAttendance,
  getAttendance,
  createLeave,
  getLeaves,
  updateLeave,
  updateLeaveStatus,
  updatePayrollStatus,
  createPayroll,
  getPayrolls,
  createContribution,
  getContributions,
  createIncidentReport,
  getIncidentReports,
  updateIncidentReportStatus,
  createNTE,
  getNTEs,
  updateNTEStatus,
} from "../api/employeeApi";

import PresentEmployeesCard from "../components/PresentEmployeesCard";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeDetails from "../components/EmployeeDetails";
import AttendanceForm from "../components/AttendanceForm";
import PayrollTable from "../components/PayrollTable";
import LeaveForm from "../components/LeaveForm";
import LeaveTable from "../components/LeaveTable";
import PayrollForm from "../components/PayrollForm";
import ContributionForm from "../components/ContributionForm";
import ContributionTable from "../components/ContributionTable";
import IncidentReportForm from "../components/IncidentReportForm";
import IncidentReportTable from "../components/IncidentReportTable";
import NTEForm from "../components/NTEForm";
import NTEReportTable from "../components/NTEReportTable";

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

function EmployeesPage({ initialTab = "employees" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);

  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday);

  const [leaves, setLeaves] = useState([]);
  const [editingLeave, setEditingLeave] = useState(null);

  const [payrolls, setPayrolls] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);
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
    fetchEmployees();
    fetchAttendance();
    fetchLeaves();
    fetchPayrolls();
    fetchContributions();
    fetchIncidentReports();
    fetchNTEs();
  }, [
    fetchAttendance,
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
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save employee"));
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteEmployee = async (id) => {
    const confirmDelete = window.confirm(
      "Warning: Are you sure you want to delete this employee? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to delete employee"));
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
      fetchLeaves();
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error, "Failed to save leave"));
    }
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
        <>
          <EmployeeForm
            onSubmit={handleSaveEmployee}
            selectedEmployee={selectedEmployee}
            onCancelEdit={() => setSelectedEmployee(null)}
          />

          {loading ? (
            <p>Loading employees...</p>
          ) : (
            <>
              <EmployeeTable
                employees={employees}
                onDelete={handleDeleteEmployee}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateEmployeeStatus}
                onEdit={handleEditEmployee}
              />

              <EmployeeDetails
                details={selectedDetails}
                onClose={() => setSelectedDetails(null)}
              />
            </>
          )}
        </>
      )}

      {activeTab === "attendance" && (
        <section className="attendance-page">
          <AttendanceForm employees={employees} onSubmit={handleSubmitAttendance} />

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
            <button
              type="button"
              className="attendance-clear-btn"
              onClick={handleSetToday}
            >
              Today
            </button>
          </div>

          <PresentEmployeesCard
            attendance={attendance}
            selectedDate={selectedDate}
          />
        </section>
      )}

      {activeTab === "leave" && (
        <>
          <LeaveForm
            employees={employees}
            onSubmit={handleSubmitLeave}
            editingLeave={editingLeave}
            onCancelEdit={() => setEditingLeave(null)}
          />

          <LeaveTable
            leaves={leaves}
            onUpdateStatus={handleUpdateLeaveStatus}
            onEdit={setEditingLeave}
          />
        </>
      )}

      {activeTab === "payroll" && (
        <>
          <PayrollForm employees={employees} onSubmit={handleSubmitPayroll} />

          <PayrollTable
            payrolls={payrolls}
            onUpdateStatus={handleUpdatePayrollStatus}
          />
        </>
      )}

      {activeTab === "contribution" && (
        <>
          <ContributionForm
            employees={employees}
            onSubmit={handleSubmitContribution}
          />

          <ContributionTable contributions={contributions} />
        </>
      )}

      {activeTab === "ir" && (
        <>
          <IncidentReportForm
            employees={employees}
            onSubmit={handleSubmitIncidentReport}
          />

          <IncidentReportTable
            reports={incidentReports}
            onUpdateStatus={handleUpdateIncidentStatus}
          />
        </>
      )}

      {activeTab === "nte" && (
        <>
          <NTEForm employees={employees} onSubmit={handleSubmitNTE} />

          <NTEReportTable ntes={ntes} onUpdateStatus={handleUpdateNTEStatus} />
        </>
      )}
    </div>
  );
}

export default EmployeesPage;
