import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

import {
  getEmployees,
  getEmployeeFullDetails,
  createEmployee,
  deleteEmployee,
  createAttendance,

   createLeave,
  getLeaves,
  updateLeave,
  updateLeaveStatus,

  updatePayrollStatus,
  createPayroll,
  getPayrolls,
  createContribution,
  createIncidentReport,
  createNTE,
  updateEmployee,
  getAttendance
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
import IncidentReportForm from "../components/IncidentReportForm";
import NTEForm from "../components/NTEForm";

function EmployeesPage({ initialTab = "employees" }) {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [payrolls, setPayrolls] = useState([]);
  const [leaves, setLeaves] = useState([]);
const [editingLeave, setEditingLeave] = useState(null);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [statusPassword, setStatusPassword] = useState("");
  const [statusError, setStatusError] = useState("");
  const [pendingStatusChange, setPendingStatusChange] = useState(null);

const fetchLeaves = async () => {
  try {
    const res = await getLeaves();
    setLeaves(res.data.data || []);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch leaves");
  }
};

const handleSubmitLeave = async (data) => {
  try {
    if (editingLeave) {
      await updateLeave(editingLeave._id, data);
      alert("Leave updated");
      setEditingLeave(null);
    } else {
      await createLeave(data);
      alert("Leave filed");
    }

    fetchLeaves();
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to save leave"
    );
  }
};

const handleUpdateLeaveStatus = async (id, status) => {
  try {
    await updateLeaveStatus(id, status);
    alert("Leave status updated");
    fetchLeaves();
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to update leave status"
    );
  }
};
  const fetchPayrolls = async () => {
    try {
      const res = await getPayrolls();
      setPayrolls(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch payrolls");
    }
  };

  const handleUpdatePayrollStatus = async (id, status) => {
    try {
      await updatePayrollStatus(id, status);
      alert("Payroll status updated");
      fetchPayrolls();
    } catch (error) {
      console.error(error);
      alert("Failed to update payroll status");
    }
  };
  const handleUpdateEmployeeStatus = (employee, status) => {
    setPendingStatusChange({ employee, status });
    setStatusPassword("");
    setStatusError("");
    setStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = async (event) => {
    event.preventDefault();

    if (!pendingStatusChange) {
      return;
    }

    if (user?.role !== "super_admin") {
      setStatusError("Super admin authorization is required.");
      return;
    }

    if (statusPassword.trim().length < 8) {
      setStatusError("Enter the super admin password (at least 8 characters).");
      return;
    }

    try {
      await updateEmployee(pendingStatusChange.employee._id, {
        employmentStatus: pendingStatusChange.status,
      });

      alert("Employee status updated");
      fetchEmployees();
      setStatusConfirmOpen(false);
      setPendingStatusChange(null);
      setStatusPassword("");
    } catch (error) {
      console.error(error);
      setStatusError("Failed to update employee status");
    }
  };


  const fetchAttendance = async () => {
    try {
      const res = await getAttendance();
      setAttendance(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch attendance");
    }
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
  const fetchEmployees = async () => {
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
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    fetchPayrolls();
    fetchLeaves();
  }, []);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSetToday = () => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  };

  const handleCreateEmployee = async (formData) => {
    try {
      await createEmployee(formData);
      alert("Employee added successfully");
      fetchEmployees();
      setAddEmployeeOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to add employee");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployee(id);
      alert("Employee deleted");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  const tabs = [
    { key: "employees", label: "Employees" },
    { key: "attendance", label: "Attendance" },
    { key: "leave", label: "Leave" },
    { key: "payroll", label: "Payroll" },
    { key: "contribution", label: "Contributions" },
    { key: "ir", label: "IR" },
    { key: "nte", label: "NTE" },
  ];

  return (
    <div className="employee-page">
      <header className="page-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage staff records, attendance, and internal workflows.</p>
        </div>
      </header>

      <div className="tab-row" role="tablist" aria-label="Employee sections">
        {tabs.map((tab) => (
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
        <section className="employee-list-section">
          <div className="employee-list-inner">
            <div className="employee-list-header">
              <div>
                <h2>Employee List</h2>
                <p>Manage employees, statuses, and profile records.</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setAddEmployeeOpen(true)}>
                + Add Employee
              </button>
            </div>

            {loading ? (
              <p>Loading employees...</p>
            ) : (
              <>
                <EmployeeTable
                  employees={employees}
                  onDelete={handleDeleteEmployee}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateEmployeeStatus}
                />

                <EmployeeDetails
                  details={selectedDetails}
                  onClose={() => setSelectedDetails(null)}
                />
              </>
            )}
          </div>
        </section>
      )}

      {activeTab === "attendance" && (
        <section className="attendance-page">
          <AttendanceForm
            employees={employees}
            onSubmit={async (data) => {
              try {
                await createAttendance(data);
                alert("Attendance saved");
                fetchAttendance();
              } catch (error) {
                alert(
                  error.response?.data?.message ||
                  "Failed to save attendance"
                );
              }
            }}
          />

          <div className="attendance-filters">
            <div className="attendance-filter-field">
              <label htmlFor="attendance-date">Calendar date</label>
              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <button type="button" className="attendance-clear-btn" onClick={handleSetToday}>
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
          <PayrollForm
            employees={employees}
            onSubmit={async (data) => {
              try {
                await createPayroll(data);
                alert("Payroll created");
                fetchPayrolls();
              } catch (error) {
                alert(
                  error.response?.data?.message ||
                  "Failed to create payroll"
                );
              }
            }}
          />

          <PayrollTable
            payrolls={payrolls}
            onUpdateStatus={handleUpdatePayrollStatus}
          />
        </>
      )}

      {activeTab === "contribution" && (
        <ContributionForm
          employees={employees}
          onSubmit={async (data) => {
            await createContribution(data);
            alert("Contribution saved");
          }}
        />
      )}

      {activeTab === "ir" && (
        <IncidentReportForm
          employees={employees}
          onSubmit={async (data) => {
            await createIncidentReport(data);
            alert("Incident report saved");
          }}
        />
      )}

      {activeTab === "nte" && (
        <NTEForm
          employees={employees}
          onSubmit={async (data) => {
            await createNTE(data);
            alert("NTE saved");
          }}
        />
      )}

      {statusConfirmOpen && (
        <div className="modal-backdrop">
          <div className="modal-body">
            <div className="modal-header">
              <h3>Confirm Status Change</h3>
              <button type="button" onClick={() => setStatusConfirmOpen(false)}>
                Close
              </button>
            </div>

            <form className="modal-form-scroll" onSubmit={handleConfirmStatusChange}>
              <p>
                You are changing the status for{" "}
                <strong>
                  {pendingStatusChange?.employee?.firstName} {pendingStatusChange?.employee?.lastName}
                </strong>
                to{" "}
                <strong>{pendingStatusChange?.status}</strong>.
              </p>

              <label className="form-group">
                <span>Super admin password</span>
                <input
                  type="password"
                  value={statusPassword}
                  onChange={(event) => setStatusPassword(event.target.value)}
                  placeholder="Enter password"
                  required
                />
              </label>

              {statusError && <p style={{ color: "#cf4f45" }}>{statusError}</p>}

              <div className="modal-form-actions">
                <button type="button" onClick={() => setStatusConfirmOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addEmployeeOpen && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setAddEmployeeOpen(false);
            }
          }}
        >
          <div className="modal-body">
            <div className="modal-header">
              <h3>Add Employee</h3>
              <button type="button" onClick={() => setAddEmployeeOpen(false)}>
                Close
              </button>
            </div>
            <div className="modal-form-scroll">
              <EmployeeForm onSubmit={handleCreateEmployee} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;