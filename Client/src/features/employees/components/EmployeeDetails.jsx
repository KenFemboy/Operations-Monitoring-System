const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const formatMoney = (value) =>
  `PHP ${Number(value || 0).toFixed(2)}`;

const getPayrollDaysWorked = (payroll) => {
  if (payroll.totalDaysWorked !== undefined && payroll.totalDaysWorked !== null) {
    return Number(payroll.totalDaysWorked || 0);
  }

  return Number(payroll.totalHoursWorked || 0) / 8;
};

const getImageUrl = (publicPath = "") => {
  if (!publicPath) return "";

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return `${apiUrl}${publicPath}`;
};

function InfoSection({ title, items }) {
  return (
    <section className="table-card">
      <div className="table-toolbar">
        <h3 className="table-title">{title}</h3>
      </div>
      <div className="employee-details-meta">
        {items.map((item) => (
          <p key={item.label}>
            <strong>{item.label}:</strong> {item.value || "-"}
          </p>
        ))}
      </div>
    </section>
  );
}

function EmployeeDetails({ details, onClose }) {
  if (!details) return null;

  const {
    employee,
    attendance,
    payrolls,
    leaves,
    contributions,
    incidentReports,
    ntes,
  } = details;
  const employeePhotoUrl = getImageUrl(employee.photo);

  return (
    <div
      className="employee-details-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="employee-details-card">
        <div className="employee-details-header">
          {employeePhotoUrl ? (
            <img
              src={employeePhotoUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
              style={styles.employeePhoto}
            />
          ) : (
            <div style={styles.employeePhotoPlaceholder}>No Photo</div>
          )}
          <div>
            <p className="employee-details-eyebrow">Employee Profile</p>
            <h2>
              {employee.firstName} {employee.middleName} {employee.lastName}
            </h2>
          </div>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="employee-details-scroll">
          <InfoSection
            title="Basic Information"
            items={[
              { label: "Employee ID", value: employee.employeeId },
              { label: "Position", value: employee.position },
              {
                label: "Assigned Branch",
                value: employee.branch?.branchName || employee.assignedBranch,
              },
              { label: "Employment Status", value: employee.employmentStatus },
              { label: "Date Hired", value: formatDate(employee.dateHired) },
              { label: "Gender", value: employee.gender },
              { label: "Birthdate", value: formatDate(employee.birthdate) },
              { label: "Age", value: employee.age },
              { label: "Marital Status", value: employee.maritalStatus },
              { label: "Religion", value: employee.religion },
              { label: "Permanent Address", value: employee.permanentAddress },
            ]}
          />

          <InfoSection
            title="Compliance / Documents"
            items={[
              { label: "NBI / Police Clearance", value: employee.nbiPoliceClearance },
              { label: "Health Card", value: employee.healthCard },
            ]}
          />

          <InfoSection
            title="Education"
            items={[
              { label: "Educational Attainment", value: employee.educationalAttainment },
              { label: "Course Specification", value: employee.courseSpecification },
              { label: "School Name", value: employee.schoolName },
              { label: "School Period", value: employee.schoolPeriod },
            ]}
          />

          <InfoSection
            title="Contacts"
            items={[
              { label: "Phone Number", value: employee.phoneNumber || employee.phone },
              { label: "Email", value: employee.email },
            ]}
          />

          <InfoSection
            title="Emergency Contact"
            items={[
              { label: "Full Name", value: employee.emergencyContact?.fullName },
              { label: "Relationship", value: employee.emergencyContact?.relationship },
              { label: "Contact Number", value: employee.emergencyContact?.contactNumber },
            ]}
          />

          <InfoSection
            title="Previous Work Experience"
            items={[
              { label: "Position", value: employee.previousWorkExperience?.position },
              { label: "Company Name", value: employee.previousWorkExperience?.companyName },
              { label: "Tenure", value: employee.previousWorkExperience?.tenure },
            ]}
          />

          <InfoSection
            title="Mandatory Government Benefits"
            items={[
              { label: "SSS", value: employee.sss || employee.sssId },
              { label: "PhilHealth", value: employee.philhealth || employee.philhealthId },
              { label: "Pag-IBIG", value: employee.pagibig || employee.pagibigId },
              { label: "TIN", value: employee.tin },
            ]}
          />

          <InfoSection
            title="Compensation"
            items={[
              { label: "Basic Rate / Daily Rate", value: formatMoney(employee.basicRate ?? employee.salaryRate) },
              { label: "Allowance", value: formatMoney(employee.allowance) },
              { label: "Mode of Salary", value: employee.modeOfSalary },
              { label: "Employment", value: employee.employmentContract },
            ]}
          />

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Attendance</h3>
            </div>
            {attendance.length === 0 ? (
              <div className="table-empty">No attendance records.</div>
            ) : (
              <div className="table-wrapper employee-attendance-scroll">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Hours</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.timeIn || "-"}</td>
                        <td>{item.timeOut || "-"}</td>
                        <td>{Number(item.totalHours || 0).toFixed(2)} hrs</td>
                        <td>
                          <span className={`status-pill status-${item.status}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Payroll</h3>
            </div>
            {payrolls.length === 0 ? (
              <div className="table-empty">No payroll records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Period Start</th>
                      <th>Period End</th>
                      <th>Daily Rate</th>
                      <th>Days Worked</th>
                      <th>Basic Pay</th>
                      <th>Overtime</th>
                      <th>Deductions</th>
                      <th>Net Pay</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.payPeriodStart)}</td>
                        <td>{formatDate(item.payPeriodEnd)}</td>
                        <td>{formatMoney(item.dailyRate ?? item.hourlyRate)}</td>
                        <td>{getPayrollDaysWorked(item).toFixed(2)}</td>
                        <td>{formatMoney(item.basicPay)}</td>
                        <td>{formatMoney(item.overtimePay)}</td>
                        <td>{formatMoney(item.deductions)}</td>
                        <td>{formatMoney(item.netPay)}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Leave</h3>
            </div>
            {leaves.length === 0 ? (
              <div className="table-empty">No leave records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((item) => (
                      <tr key={item._id}>
                        <td>{item.leaveType}</td>
                        <td>{formatDate(item.startDate)}</td>
                        <td>{formatDate(item.endDate)}</td>
                        <td>{item.reason || "-"}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Contributions</h3>
            </div>
            {contributions.length === 0 ? (
              <div className="table-empty">No contribution records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>SSS</th>
                      <th>Pag-IBIG</th>
                      <th>PhilHealth</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((item) => (
                      <tr key={item._id}>
                        <td>{item.month}</td>
                        <td>{formatMoney(item.sss)}</td>
                        <td>{formatMoney(item.pagibig)}</td>
                        <td>{formatMoney(item.philhealth)}</td>
                        <td>{formatMoney(item.totalContribution)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Incident Reports</h3>
            </div>
            {incidentReports.length === 0 ? (
              <div className="table-empty">No incident reports.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Action Taken</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentReports.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.incidentDate)}</td>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{item.actionTaken}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="table-card">
            <div className="table-toolbar">
              <h3 className="table-title">Notice to Explain</h3>
            </div>
            {ntes.length === 0 ? (
              <div className="table-empty">No NTE records.</div>
            ) : (
              <div className="table-wrapper">
                <table className="employee-details-table">
                  <thead>
                    <tr>
                      <th>Issue Date</th>
                      <th>Subject</th>
                      <th>Explanation</th>
                      <th>Deadline</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ntes.map((item) => (
                      <tr key={item._id}>
                        <td>{formatDate(item.issueDate)}</td>
                        <td>{item.subject}</td>
                        <td>{item.explanation || "-"}</td>
                        <td>{formatDate(item.deadline)}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  employeePhoto: {
    width: "160px",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
    flex: "0 0 auto",
  },
  employeePhotoPlaceholder: {
    width: "160px",
    height: "160px",
    borderRadius: "12px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    display: "grid",
    placeItems: "center",
    fontWeight: "600",
    flex: "0 0 auto",
  },
};

export default EmployeeDetails;
