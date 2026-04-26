import React, { useEffect, useMemo } from "react";
import useAttendance from "../hooks/useAttendance";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceFilters from "../components/AttendanceFilters";
import AttendanceSummaryCards from "../components/AttendanceSummaryCards";

const AttendancePage = () => {
  const {
    attendance,
    filters,
    setFilters,
    fetchAttendance,
  } = useAttendance();

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const totalLateMinutes = useMemo(
    () => attendance.reduce((total, item) => total + item.lateMinutes, 0),
    [attendance]
  );

  const totalOvertime = useMemo(
    () => attendance.reduce((total, item) => total + item.overtimeHours, 0),
    [attendance]
  );

  return (
    <section className="attendance-page">
      <header className="page-header attendance-header">
        <div>
          <p className="attendance-eyebrow">Daily Workforce Log</p>
          <h1>Attendance</h1>
          <p>Monitor time records, late arrivals, leave, and overtime.</p>
        </div>
        <div className="attendance-header-panel" aria-label="Attendance totals">
          <span>{attendance.length} records</span>
          <strong>{totalLateMinutes} late mins</strong>
          <span>{totalOvertime.toFixed(1)} OT hrs</span>
        </div>
      </header>

      <AttendanceFilters filters={filters} setFilters={setFilters} />

      <AttendanceSummaryCards data={attendance} />

      <AttendanceTable data={attendance} />
    </section>
  );
};

export default AttendancePage;
