import { useMemo, useState } from 'react'
import Button from '../../shared/components/Button'
import Table from '../../shared/components/Table'
import useAttendance from '../hooks/useAttendance'
import { attendanceColumns } from '../utils/attendanceColumns'

function AttendancePage() {
  const rows = useAttendance()
  const [department, setDepartment] = useState('All')
  const [shift, setShift] = useState('All')
  const [selectedDate, setSelectedDate] = useState('2026-04-19')
  const [searchText, setSearchText] = useState('')

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesDepartment =
        department === 'All' || row.department === department
      const matchesShift = shift === 'All' || row.shift === shift
      const matchesDate = !selectedDate || row.date === selectedDate
      const matchesSearch = row.employeeName
        .toLowerCase()
        .includes(searchText.toLowerCase())

      return matchesDepartment && matchesShift && matchesDate && matchesSearch
    })
  }, [rows, department, shift, selectedDate, searchText])

  const tableRows = filteredRows.map((row) => ({
    ...row,
    timeIn: <input type="time" defaultValue={row.timeIn} className="time-input" />,
    timeOut: <input type="time" defaultValue={row.timeOut} className="time-input" />,
    status: (
      <select defaultValue={row.status} className="inline-select">
        <option value="Present">Present</option>
        <option value="Late">Late</option>
        <option value="Absent">Absent</option>
        <option value="Off">Off</option>
      </select>
    ),
  }))

  const monthlyRows = useMemo(() => {
    const monthlyMap = new Map()

    rows.forEach((row) => {
      const key = row.employeeName
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          id: key,
          employeeName: key,
          presentDays: 0,
          lateDays: 0,
          absentDays: 0,
        })
      }

      const item = monthlyMap.get(key)
      if (row.status === 'Present') item.presentDays += 1
      if (row.status === 'Late') item.lateDays += 1
      if (row.status === 'Absent') item.absentDays += 1
    })

    return Array.from(monthlyMap.values())
  }, [rows])

  const recentRows = [...rows].sort((a, b) => b.id - a.id).slice(0, 3)

  return (
    <section>
      <header className="page-header">
        <h1>Attendance</h1>
        <p>Daily and monthly attendance monitoring for all branches</p>
      </header>

      <section className="card" style={{ marginBottom: '1rem' }}>
        <h3>Filters</h3>
        <div className="filter-grid">
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Front of House">Front of House</option>
              <option value="Service">Service</option>
              <option value="Back of House">Back of House</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="shift">Shift</label>
            <select
              id="shift"
              value={shift}
              onChange={(event) => setShift(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="attendanceDate">Date</label>
            <input
              id="attendanceDate"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="searchAttendance">Search</label>
            <input
              id="searchAttendance"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search employee"
            />
          </div>
        </div>
        <Button>Submit</Button>
      </section>

      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Attendance Records</h3>
        </div>
        <Table
          columns={attendanceColumns}
          rows={tableRows}
          renderActions={() => <Button variant="outline">Time In / Time Out</Button>}
        />
      </section>

      <section className="table-card" style={{ marginTop: '1rem' }}>
        <div className="table-toolbar">
          <h3 className="table-title">Monthly Attendance View</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Present Days</th>
                <th>Late Days</th>
                <th>Absent Days</th>
              </tr>
            </thead>
            <tbody>
              {monthlyRows.map((item) => (
                <tr key={item.id}>
                  <td>{item.employeeName}</td>
                  <td>{item.presentDays}</td>
                  <td>{item.lateDays}</td>
                  <td>{item.absentDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h3>Recent Attendance</h3>
        <ul className="recent-list">
          {recentRows.map((item) => (
            <li key={item.id}>
              <strong>{item.employeeName}</strong> - {item.branch} - {item.status}
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default AttendancePage
