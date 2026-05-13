import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../auth/context/AuthContext";

import {
  getProducts,
  getPurchases,
  getStockIns,
  getStockOuts,
} from "../../../api/admin/adminInventoryApi";
import { getBranches } from "../../../api/admin/adminBranchApi";

import ProductForm from "../../../features/inventory/components/ProductForm";
import ProductTable from "../../../features/inventory/components/ProductTable";

import PurchaseForm from "../../../features/inventory/components/PurchaseForm";
import PurchaseTable from "../../../features/inventory/components/PurchaseTable";

import StockInForm from "../../../features/inventory/components/StockInForm";
import StockInTable from "../../../features/inventory/components/StockInTable";

import StockOutForm from "../../../features/inventory/components/StockOutForm";
import StockOutTable from "../../../features/inventory/components/StockOutTable";

import InventoryRecordsFilter from "../../../features/inventory/components/InventoryRecordsFilter";
import InventoryRecordsTable from "../../../features/inventory/components/InventoryRecordsTable";

function InventoryPage() {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = ["super_admin", "superadmin"].includes(
    (user?.role || "").toLowerCase()
  );
  const [activeTab, setActiveTab] = useState("products");

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stockIns, setStockIns] = useState([]);
  const [stockOuts, setStockOuts] = useState([]);
  const [inventoryRecords, setInventoryRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBranches();
      setBranches(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async (branchId = selectedBranch?._id) => {
    if (isSuperAdmin && !branchId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const params = branchId ? { branchId } : {};
      const productRes = await getProducts(params);
      const purchaseRes = await getPurchases(params);
      const stockInRes = await getStockIns(params);
      const stockOutRes = await getStockOuts(params);

      setProducts(productRes.data.products || []);
      setPurchases(purchaseRes.data.purchases || []);
      setStockIns(stockInRes.data.stockIns || []);
      setStockOuts(stockOutRes.data.stockOuts || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchBranches();
      return;
    }

    fetchAllData();
  }, [isSuperAdmin]);

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setInventoryRecords([]);
    setActiveTab("products");
    fetchAllData(branch._id);
  };

  const handleBackToBranches = () => {
    setSelectedBranch(null);
    setProducts([]);
    setPurchases([]);
    setStockIns([]);
    setStockOuts([]);
    setInventoryRecords([]);
  };

  const refreshSelectedInventory = () => {
    fetchAllData(selectedBranch?._id);
  };

  return (
    <div style={styles.page}>
      <h1>Inventory Management</h1>
      <p>
        {isSuperAdmin
          ? "Select a branch to view and manage its inventory."
          : "Manage products, purchases, stock in, stock out, and inventory records."}
      </p>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading inventory...</p>}

      {isSuperAdmin && !selectedBranch && (
        <section style={styles.branchSection}>
          <h2>Branches</h2>
          <div style={styles.branchGrid}>
            {branches.map((branch) => (
              <button
                key={branch._id}
                type="button"
                onClick={() => handleSelectBranch(branch)}
                style={styles.branchCard}
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
          <button type="button" onClick={handleBackToBranches} style={styles.tab}>
            Back to Branches
          </button>
        </div>
      )}

      {isSuperAdmin && !selectedBranch ? null : (
        <>
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab("products")}
              style={activeTab === "products" ? styles.activeTab : styles.tab}
            >
              Products
            </button>

            <button
              onClick={() => setActiveTab("purchases")}
              style={activeTab === "purchases" ? styles.activeTab : styles.tab}
            >
              Purchases
            </button>

            <button
              onClick={() => setActiveTab("stockIn")}
              style={activeTab === "stockIn" ? styles.activeTab : styles.tab}
            >
              Stock In
            </button>

            <button
              onClick={() => setActiveTab("stockOut")}
              style={activeTab === "stockOut" ? styles.activeTab : styles.tab}
            >
              Stock Out
            </button>

            <button
              onClick={() => setActiveTab("records")}
              style={activeTab === "records" ? styles.activeTab : styles.tab}
            >
              Inventory Records
            </button>
          </div>

          {activeTab === "products" && (
            <>
              <ProductForm
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
                branchId={selectedBranch?._id || ""}
              />
              <ProductTable
                products={products}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
            </>
          )}

          {activeTab === "purchases" && (
            <>
              <PurchaseForm
                products={products}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
              <PurchaseTable
                purchases={purchases}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
            </>
          )}

          {activeTab === "stockIn" && (
            <>
              <StockInForm
                products={products}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
              <StockInTable
                stockIns={stockIns}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
            </>
          )}

          {activeTab === "stockOut" && (
            <>
              <StockOutForm
                products={products}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
              <StockOutTable
                stockOuts={stockOuts}
                onRefresh={isSuperAdmin ? refreshSelectedInventory : fetchAllData}
              />
            </>
          )}

          {activeTab === "records" && (
            <>
              <InventoryRecordsFilter
                onRecordsLoaded={setInventoryRecords}
                branchId={selectedBranch?._id || ""}
              />
              <InventoryRecordsTable records={inventoryRecords} />
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
  tabs: {
    display: "flex",
    gap: "10px",
    margin: "20px 0",
    flexWrap: "wrap",
  },
  tab: {
    padding: "10px 16px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
  activeTab: {
    padding: "10px 16px",
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
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
    marginTop: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
  },
};

export default InventoryPage;
