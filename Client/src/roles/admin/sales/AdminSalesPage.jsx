import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";

import {
  getSales,
  getDailySales,
  getMonthlySales,
} from "../../../api/admin/adminSalesApi";
import { getBranches } from "../../../api/admin/adminBranchApi";

import SaleForm from "../../../features/sales/components/SaleForm";
import SalesFilter from "../../../features/sales/components/SalesFilter";
import SalesSummaryCards from "../../../features/sales/components/SalesSummaryCards";
import SalesTable from "../../../features/sales/components/SalesTable";

function SalesPage() {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
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
  const branchHues = [18, 32, 48, 88, 132, 176, 210, 238, 268, 300, 330];

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBranches();
      setBranches(response.data.data || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async (branchId = selectedBranch?._id) => {
    if (isSuperAdmin && !branchId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await getSales(
        filter.startDate,
        filter.endDate,
        filter.serviceType,
        branchId || ""
      );

      setSales(res.data.sales || []);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async (branchId = selectedBranch?._id) => {
    if (isSuperAdmin && !branchId) {
      return;
    }

    try {
      const dailyRes = await getDailySales(today, branchId || "");
      const monthlyRes = await getMonthlySales(currentYear, currentMonth, branchId || "");

      setDailySummary(dailyRes.data);
      setMonthlySummary(monthlyRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshAll = async (branchId = selectedBranch?._id) => {
    await fetchSales(branchId);
    await fetchSummaries(branchId);
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchBranches();
      return;
    }

    refreshAll("");
  }, [isSuperAdmin]);

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setSales([]);
    setDailySummary(null);
    setMonthlySummary(null);
    refreshAll(branch._id);
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setSales([]);
    setDailySummary(null);
    setMonthlySummary(null);
  };

  const refreshSelectedSales = () => {
    refreshAll(selectedBranch?._id || "");
  };

  return (
    <div style={styles.page}>
      <h1>Sales Management</h1>
      <p>
        {isSuperAdmin
          ? "Select a branch to view and manage its sales."
          : "Record buffet sales for lunch and dinner, then view daily and monthly totals."}
      </p>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading sales...</p>}

      {isSuperAdmin && !selectedBranch && (
        <section className="ops-branch-section">
          <h2>Branches</h2>
          <div className="ops-branch-grid">
            {branches.map((branch, index) => (
              <button
                key={branch._id}
                type="button"
                onClick={() => handleSelectBranch(branch)}
                className="ops-branch-card"
                aria-pressed={false}
                style={{ "--branch-hue": branchHues[index % branchHues.length] }}
              >
                <strong>{branch.branchName}</strong>
                <span>{branch.location || "No location"}</span>
                <small>{branch.address || "No address"}</small>
              </button>
            ))}
          </div>
          {branches.length === 0 && !loading && <p>No branches found.</p>}
        </section>
      )}

      {isSuperAdmin && selectedBranch && (
        <div style={styles.selectedBranchBar}>
          <div>
            <strong>{selectedBranch.branchName}</strong>
            <span>{selectedBranch.location || "No location"}</span>
          </div>
          <button type="button" onClick={handleBackToBranches} style={styles.backButton}>
            Back to Branches
          </button>
        </div>
      )}

      {isSuperAdmin && !selectedBranch ? null : (
        <>
          <SalesSummaryCards
            dailySummary={dailySummary}
            monthlySummary={monthlySummary}
          />

          <SaleForm
            onRefresh={isSuperAdmin ? refreshSelectedSales : refreshAll}
            branchId={selectedBranch?._id || ""}
          />

          <SalesFilter
            filter={filter}
            setFilter={setFilter}
            onFilter={() => fetchSales(selectedBranch?._id || "")}
          />

          <SalesTable
            sales={sales}
            onRefresh={isSuperAdmin ? refreshSelectedSales : refreshAll}
          />
        </>
      )}
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
  branchSection: {
    marginTop: "20px",
  },
  branchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  branchCard: {
    display: "grid",
    gap: "6px",
    padding: "16px",
    textAlign: "left",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
  },
  selectedBranchBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px",
    margin: "16px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
  backButton: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

export default SalesPage;
