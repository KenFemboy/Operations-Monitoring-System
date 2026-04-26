export const getAttendance = async (filters) => {
  // fake delay
  await new Promise((res) => setTimeout(res, 300));

  const mock = [
    {
      employeeName: "John Doe",
      date: "2026-04-01",
      timeIn: "08:05",
      timeOut: "17:00",
      lateMinutes: 5,
      overtimeHours: 1,
      status: "late",
    },
    {
      employeeName: "Jane Smith",
      date: "2026-04-01",
      timeIn: "08:00",
      timeOut: "17:00",
      lateMinutes: 0,
      overtimeHours: 0,
      status: "present",
    },
    {
      employeeName: "Mike Ross",
      date: "2026-04-01",
      timeIn: null,
      timeOut: null,
      lateMinutes: 0,
      overtimeHours: 0,
      status: "absent",
    },
    {
      employeeName: "Aira Santos",
      date: "2026-04-02",
      timeIn: "07:54",
      timeOut: "17:35",
      lateMinutes: 0,
      overtimeHours: 0.5,
      status: "present",
    },
    {
      employeeName: "Carlo Reyes",
      date: "2026-04-02",
      timeIn: "08:18",
      timeOut: "17:00",
      lateMinutes: 18,
      overtimeHours: 0,
      status: "late",
    },
    {
      employeeName: "Liza Cruz",
      date: "2026-04-02",
      timeIn: null,
      timeOut: null,
      lateMinutes: 0,
      overtimeHours: 0,
      status: "leave",
    },
  ];

  return mock.filter((record) => {
    const matchesStatus = !filters.status || record.status === filters.status;
    const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo;

    return matchesStatus && matchesDateFrom && matchesDateTo;
  });
};
