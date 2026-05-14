import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

function SalesPage({ pageView = "input" }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );
  const isSummaryView = pageView === "summary";
  const isInputView = pageView === "input";
  const isRecordsView = pageView === "records";
  const roleBasePath = location.pathname.startsWith("/superadmin")
    ? "/superadmin"
    : "/admin";
  const branchIdFromUrl = searchParams.get("branchId") || "";
  const today = new Date().toISOString().split("T")[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [branches, setBranches] = useState([]);
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
  const selectedBranch = isSuperAdmin
    ? branches.find((branch) => branch._id === branchIdFromUrl) || null
    : null;

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

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBranches();
      const loadedBranches = response.data.data || [];
      setBranches(loadedBranches);

      if (
        branchIdFromUrl &&
        loadedBranches.some((branch) => branch._id === branchIdFromUrl)
      ) {
        await refreshAll(branchIdFromUrl);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const getSalesPath = (view, branchId = selectedBranch?._id) => {
    const params = new URLSearchParams();

    if (isSuperAdmin && branchId) {
      params.set("branchId", branchId);
    }

    const query = params.toString();
    return `${roleBasePath}/sales/${view}${query ? `?${query}` : ""}`;
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchBranches();
      return;
    }

    refreshAll("");
  }, [isSuperAdmin]);

  const handleSelectBranch = (branch) => {
    setSales([]);
    setDailySummary(null);
    setMonthlySummary(null);
    navigate(getSalesPath(pageView, branch._id), { replace: true });
    refreshAll(branch._id);
  };

  const handleBackToBranches = () => {
    setSales([]);
    setDailySummary(null);
    setMonthlySummary(null);
    navigate(`${roleBasePath}/sales/${pageView}`, { replace: true });
  };

  const refreshSelectedSales = () => {
    refreshAll(selectedBranch?._id || "");
  };

  const handleSaleSaved = async () => {
    if (isSuperAdmin) {
      await refreshSelectedSales();
      navigate(getSalesPath("records", selectedBranch?._id));
      return;
    }

    await refreshAll();
    navigate(getSalesPath("records"));
  };

  return (
    <div style={styles.page}>
      <h1>Sales Management</h1>
      <p>
        {isSuperAdmin
          ? "Select a branch to view and manage its sales."
          : "Review sales summaries, record buffet sales, and manage recorded sales."}
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
          <div style={styles.viewToggle} role="tablist" aria-label="Sales views">
            <NavLink
              to={getSalesPath("summary")}
              style={({ isActive }) => ({
                ...styles.viewButton,
                ...(isActive ? styles.activeViewButton : {}),
              })}
            >
              Sales Summary
            </NavLink>
            <NavLink
              to={getSalesPath("input")}
              style={({ isActive }) => ({
                ...styles.viewButton,
                ...(isActive ? styles.activeViewButton : {}),
              })}
            >
              Sales Input
            </NavLink>
            <NavLink
              to={getSalesPath("records")}
              style={({ isActive }) => ({
                ...styles.viewButton,
                ...(isActive ? styles.activeViewButton : {}),
              })}
            >
              Recorded Sales
            </NavLink>
          </div>

          {isSummaryView && (
            <section style={styles.summarySection}>
              <h2>Sales Summary</h2>
              <SalesSummaryCards
                dailySummary={dailySummary}
                monthlySummary={monthlySummary}
              />
            </section>
          )}

          {isInputView && (
            <SaleForm
              onRefresh={handleSaleSaved}
              branchId={selectedBranch?._id || ""}
            />
          )}

          {isRecordsView && (
            <>
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
  viewToggle: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    margin: "18px 0",
  },
  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    color: "#111827",
    cursor: "pointer",
    fontWeight: "700",
    textDecoration: "none",
  },
  activeViewButton: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    color: "#ffffff",
  },
  summarySection: {
    marginTop: "8px",
  },
};

export default SalesPage;
