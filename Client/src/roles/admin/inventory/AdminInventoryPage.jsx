import { useEffect, useState } from "react";

import {
  getProducts,
  getPurchases,
  getStockIns,
  getStockOuts,
} from "../../../api/admin/adminInventoryApi";

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
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stockIns, setStockIns] = useState([]);
  const [stockOuts, setStockOuts] = useState([]);
  const [inventoryRecords, setInventoryRecords] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError("");

      const productRes = await getProducts();
      const purchaseRes = await getPurchases();
      const stockInRes = await getStockIns();
      const stockOutRes = await getStockOuts();

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
    fetchAllData();
  }, []);

  return (
    <div style={styles.page}>
      <h1>Inventory Management</h1>
      <p>Manage products, purchases, stock in, stock out, and inventory records.</p>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p>Loading inventory...</p>}

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
          <ProductForm onRefresh={fetchAllData} />
          <ProductTable products={products} />
        </>
      )}

      {activeTab === "purchases" && (
        <>
          <PurchaseForm products={products} onRefresh={fetchAllData} />
          <PurchaseTable purchases={purchases} onRefresh={fetchAllData} />
        </>
      )}

      {activeTab === "stockIn" && (
        <>
          <StockInForm products={products} onRefresh={fetchAllData} />
          <StockInTable stockIns={stockIns} />
        </>
      )}

      {activeTab === "stockOut" && (
        <>
          <StockOutForm products={products} onRefresh={fetchAllData} />
          <StockOutTable stockOuts={stockOuts} />
        </>
      )}

      {activeTab === "records" && (
        <>
          <InventoryRecordsFilter onRecordsLoaded={setInventoryRecords} />
          <InventoryRecordsTable records={inventoryRecords} />
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
};

export default InventoryPage;
