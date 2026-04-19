import { attendanceRows } from '../services/attendanceMockService'
import { useBranchContext } from '../../shared/store/branchContext'

function useAttendance() {
  const { activeBranch } = useBranchContext()

  return attendanceRows.filter((row) => row.branch === activeBranch)
}

export default useAttendance
