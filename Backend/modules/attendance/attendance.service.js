import Attendance from "../../models/Attendance.js";
import Employee from "../../models/Employee.js";
import { assertValidObjectId } from "../../middleware/accessControl.js";

const STANDARD_WORK_MINUTES = 8 * 60;
const SHIFT_START_HOUR = 8;

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const minutesBetween = (start, end) => Math.max(0, Math.round((end - start) / 60000));

const getShiftStartForDate = (date) => {
  const shiftStart = new Date(date);
  shiftStart.setHours(SHIFT_START_HOUR, 0, 0, 0);
  return shiftStart;
};

const getEmployeeOrThrow = async (employeeId) => {
  assertValidObjectId(employeeId, "employeeId");

  const employee = await Employee.findById(employeeId);

  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

export const timeIn = async ({ employeeId, timestamp = new Date() }) => {
  const employee = await getEmployeeOrThrow(employeeId);
  const timeInDate = new Date(timestamp);
  const attendanceDate = startOfDay(timeInDate);
  const lateMinutes = minutesBetween(getShiftStartForDate(attendanceDate), timeInDate);

  const attendance = await Attendance.findOneAndUpdate(
    {
      employee: employee._id,
      date: attendanceDate,
    },
    {
      $setOnInsert: {
        employee: employee._id,
        branchId: employee.assignedBranchId,
        date: attendanceDate,
      },
      $set: {
        timeIn: timeInDate,
        lateMinutes,
        status: lateMinutes > 0 ? "late" : "present",
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return attendance;
};

export const timeOut = async ({ employeeId, timestamp = new Date() }) => {
  const employee = await getEmployeeOrThrow(employeeId);
  const timeOutDate = new Date(timestamp);
  const attendanceDate = startOfDay(timeOutDate);

  const attendance = await Attendance.findOne({
    employee: employee._id,
    date: attendanceDate,
  });

  if (!attendance?.timeIn) {
    const error = new Error("Cannot time out without time in");
    error.statusCode = 400;
    throw error;
  }

  const workedMinutes = minutesBetween(attendance.timeIn, timeOutDate);
  const totalHours = Number((workedMinutes / 60).toFixed(2));
  const undertimeMinutes = Math.max(0, STANDARD_WORK_MINUTES - workedMinutes);
  const overtimeHours = Number((Math.max(0, workedMinutes - STANDARD_WORK_MINUTES) / 60).toFixed(2));

  attendance.branchId = employee.assignedBranchId;
  attendance.timeOut = timeOutDate;
  attendance.totalHours = totalHours;
  attendance.undertimeMinutes = undertimeMinutes;
  attendance.overtimeHours = overtimeHours;
  attendance.status = attendance.lateMinutes > 0 ? "late" : "present";

  return attendance.save();
};

export const getAttendanceByEmployee = async (employeeId) => {
  assertValidObjectId(employeeId, "employeeId");

  return Attendance.find({ employee: employeeId })
    .sort({ date: -1 })
    .lean();
};

export const getMonthlyAttendanceSummary = async ({ employeeId, year, month }) => {
  assertValidObjectId(employeeId, "employeeId");

  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 1);

  const rows = await Attendance.find({
    employee: employeeId,
    date: { $gte: startDate, $lt: endDate },
  }).lean();

  return rows.reduce(
    (summary, row) => {
      summary.totalWorkedDays += row.status === "present" || row.status === "late" ? 1 : 0;
      summary.totalLateMinutes += row.lateMinutes || 0;
      summary.totalUndertimeMinutes += row.undertimeMinutes || 0;
      summary.totalOvertimeHours += row.overtimeHours || 0;
      summary.totalAbsentDays += row.status === "absent" ? 1 : 0;
      return summary;
    },
    {
      employeeId,
      year: Number(year),
      month: Number(month),
      totalWorkedDays: 0,
      totalLateMinutes: 0,
      totalUndertimeMinutes: 0,
      totalOvertimeHours: 0,
      totalAbsentDays: 0,
      records: rows,
    }
  );
};
