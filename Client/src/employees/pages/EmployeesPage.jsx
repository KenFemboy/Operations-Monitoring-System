import { useEffect, useState } from "react";

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

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("employees");
  const [loading, setLoading] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2026-04-26");
  const [payrolls, setPayrolls] = useState([]);
  const [leaves, setLeaves] = useState([]);
const [editingLeave, setEditingLeave] = useState(null);

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
  const handleUpdateEmployeeStatus = async (id, status) => {
    try {
      await updateEmployee(id, {
        employmentStatus: status,
      });

      alert("Employee status updated");
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to update employee status");
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

  const handleCreateEmployee = async (formData) => {
    try {
      await createEmployee(formData);
      alert("Employee added successfully");
      fetchEmployees();
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
    <div style={{ padding: "24px" }}>
      <h1>Employee Management</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 14px",
              border: "1px solid #ccc",
              background: activeTab === tab.key ? "#222" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#222",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "employees" && (
        <>
          <EmployeeForm onSubmit={handleCreateEmployee} />

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
        </>
      )}

      {activeTab === "attendance" && (
        <>
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

          <div style={{ marginTop: "20px" }}>
            <label>Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <PresentEmployeesCard
            attendance={attendance}
            selectedDate={selectedDate}
          />
        </>
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
    </div>
  );
}

export default EmployeesPage;