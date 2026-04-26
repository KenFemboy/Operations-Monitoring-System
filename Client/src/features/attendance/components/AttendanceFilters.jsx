import React from "react";

const AttendanceFilters = ({ filters, setFilters }) => {
  const handleChange = (field) => (event) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
    });
  };

  return (
    <section className="attendance-filters" aria-label="Attendance filters">
      <div className="attendance-filter-field">
        <label htmlFor="attendance-date-from">From</label>
        <input
          id="attendance-date-from"
          type="date"
          value={filters.dateFrom || ""}
          onChange={handleChange("dateFrom")}
        />
      </div>

      <div className="attendance-filter-field">
        <label htmlFor="attendance-date-to">To</label>
        <input
          id="attendance-date-to"
          type="date"
          value={filters.dateTo || ""}
          onChange={handleChange("dateTo")}
        />
      </div>

      <div className="attendance-filter-field">
        <label htmlFor="attendance-status">Status</label>
        <select
          id="attendance-status"
          value={filters.status}
          onChange={handleChange("status")}
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      <button className="attendance-clear-btn" type="button" onClick={clearFilters}>
        Clear
      </button>
    </section>
  );
};

export default AttendanceFilters;
