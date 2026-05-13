import { useEffect, useMemo, useState } from "react";
import ArchiveTable from "../components/ArchiveTable";
import {
  getArchivedEmployees,
  getArchivedFeedback,
  getArchivedProducts,
  getArchivedPurchases,
  getArchivedSales,
  getArchivedStockIns,
  getArchivedStockOuts,
  restoreEmployee,
  restoreFeedback,
  restoreProduct,
  restorePurchase,
  restoreSale,
  restoreStockIn,
  restoreStockOut,
} from "../api/archiveApi";

const tabs = [
  {
    key: "employees",
    label: "Employees",
    getRecords: getArchivedEmployees,
    restore: restoreEmployee,
    getIdentifier: (record) =>
      `${record.employeeId || ""} ${record.firstName || ""} ${record.lastName || ""}`.trim(),
  },
  {
    key: "sales",
    label: "Sales",
    getRecords: getArchivedSales,
    restore: restoreSale,
    getIdentifier: (record) =>
      `${record.saleDate || "-"} ${record.serviceType || ""} ${record.customerName || "Walk-in"}`,
  },
  {
    key: "feedback",
    label: "Feedback",
    getRecords: getArchivedFeedback,
    restore: restoreFeedback,
    getIdentifier: (record) =>
      `${record.customerName || "Anonymous"} (${record.rating || "-"} / 5)`,
  },
  {
    key: "products",
    label: "Products",
    getRecords: getArchivedProducts,
    restore: restoreProduct,
    getIdentifier: (record) => `${record.productId || ""} ${record.name || ""}`.trim(),
  },
  {
    key: "purchases",
    label: "Purchases",
    getRecords: getArchivedPurchases,
    restore: restorePurchase,
    getIdentifier: (record) =>
      `${record.purchaseId || ""} ${record.product?.name || ""}`.trim(),
  },
  {
    key: "stockIn",
    label: "Stock In",
    getRecords: getArchivedStockIns,
    restore: restoreStockIn,
    getIdentifier: (record) =>
      `${record.stockInId || ""} ${record.product?.name || ""}`.trim(),
  },
  {
    key: "stockOut",
    label: "Stock Out",
    getRecords: getArchivedStockOuts,
    restore: restoreStockOut,
    getIdentifier: (record) =>
      `${record.stockOutId || ""} ${record.product?.name || ""}`.trim(),
  },
];

function ArchivePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [recordsByTab, setRecordsByTab] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentTab = useMemo(
    () => tabs.find((tab) => tab.key === activeTab) || tabs[0],
    [activeTab]
  );
  const records = recordsByTab[activeTab] || [];

  const fetchRecords = async (tab = currentTab) => {
    try {
      setLoading(true);
      setError("");
      const response = await tab.getRecords();
      setRecordsByTab((current) => ({
        ...current,
        [tab.key]: response.data.data || [],
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load archived records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchRecords(currentTab);
    }, 0);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab.key]);

  const handleRestore = async (record) => {
    const confirmed = window.confirm("Restore this archived record?");

    if (!confirmed) {
      return;
    }

    try {
      await currentTab.restore(record._id);
      setRecordsByTab((current) => ({
        ...current,
        [activeTab]: records.filter((item) => item._id !== record._id),
      }));
      alert("Record restored successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to restore record");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Archive</h1>
        <p style={styles.copy}>View archived records and restore them when needed.</p>
      </header>

      <div style={styles.tabs} role="tablist" aria-label="Archive sections">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={activeTab === tab.key ? styles.activeTab : styles.tab}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <ArchiveTable
        records={records}
        getIdentifier={currentTab.getIdentifier}
        onRestore={handleRestore}
        loading={loading}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    backgroundColor: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "18px",
  },
  title: {
    margin: 0,
  },
  copy: {
    margin: "6px 0 0",
    color: "#475569",
  },
  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "18px",
  },
  tab: {
    padding: "9px 13px",
    backgroundColor: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
  },
  activeTab: {
    padding: "9px 13px",
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "1px solid #1f2937",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#b91c1c",
    fontWeight: 700,
  },
};

export default ArchivePage;
