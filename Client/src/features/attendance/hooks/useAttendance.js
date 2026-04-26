import { useState } from "react";
import { getAttendance } from "../services/attendanceMockService";

const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);

  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
    status: "",
  });

  const fetchAttendance = async () => {
    const data = await getAttendance(filters);
    setAttendance(data);
  };

  return {
    attendance,
    filters,
    setFilters,
    fetchAttendance,
  };
};

export default useAttendance;