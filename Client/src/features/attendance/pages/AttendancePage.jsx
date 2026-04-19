import Table from '../../shared/components/Table'
import useAttendance from '../hooks/useAttendance'
import { attendanceColumns } from '../utils/attendanceColumns'

function AttendancePage() {
  const rows = useAttendance()

  return (
    <section>
      <header className="page-header">
        <h1>Attendance</h1>
        <p>Daily time logs based on static records</p>
      </header>
      <section className="table-card">
        <div className="table-toolbar">
          <h3 className="table-title">Attendance Records</h3>
        </div>
        <Table columns={attendanceColumns} rows={rows} />
      </section>
    </section>
  )
}

export default AttendancePage
