import { useEffect, useState } from "react";

import {
  getSales,
  getDailySales,
  getMonthlySales,
} from "../api/salesApi";

import SaleForm from "../components/SaleForm";
import SalesFilter from "../components/SalesFilter";
import SalesSummaryCards from "../components/SalesSummaryCards";
import SalesTable from "../components/SalesTable";

function SalesPage() {
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [sales, setSales] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);

  const [filter, setFilter] = useState({
    startDate: today,
    endDate: today,
    serviceType: "all",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getSales(
        filter.startDate,
        filter.endDate,
        filter.serviceType
      );

      setSales(res.data.sales || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async () => {
    try {
      const dailyRes = await getDailySales(today);
      const monthlyRes = await getMonthlySales(currentYear, currentMonth);

      setDailySummary(dailyRes.data);
      setMonthlySummary(monthlyRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshAll = async () => {
    await fetchSales();
    await fetchSummaries();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <div style={styles.page}>
      <h1>Sales Management</h1>
      <p>Record buffet sales for lunch and dinner, then view daily and monthly totals.</p>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading sales...</p>}

      <SalesSummaryCards
        dailySummary={dailySummary}
        monthlySummary={monthlySummary}
      />

      <SaleForm onRefresh={refreshAll} />

      <SalesFilter
        filter={filter}
        setFilter={setFilter}
        onFilter={fetchSales}
      />

      <SalesTable sales={sales} onRefresh={refreshAll} />
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
};

export default SalesPage;