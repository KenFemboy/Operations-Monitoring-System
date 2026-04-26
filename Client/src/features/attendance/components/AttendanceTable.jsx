import React from "react";

const statusLabels = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  leave: "On Leave",
};

const AttendanceTable = ({ data }) => {
  return (
    <section className="table-card attendance-table-card">
      <div className="table-toolbar">
        <div>
          <p className="attendance-table-kicker">Filtered Results</p>
          <h3 className="table-title">Timekeeping Records</h3>
        </div>
        <span className="attendance-count">{data.length} entries</span>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Late</th>
              <th>OT</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item, index) => (
                <tr key={`${item.employeeName}-${item.date}-${index}`}>
                  <td>
                    <div className="attendance-employee">
                      <span>{item.employeeName.charAt(0)}</span>
                      <strong>{item.employeeName}</strong>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.timeIn || "-"}</td>
                  <td>{item.timeOut || "-"}</td>
                  <td>{item.lateMinutes ? `${item.lateMinutes} mins` : "-"}</td>
                  <td>{item.overtimeHours ? `${item.overtimeHours} hrs` : "-"}</td>
                  <td>
                    <span className={`attendance-status ${item.status}`}>
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="attendance-empty" colSpan="7">
                  No attendance records match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AttendanceTable;
