import express from "express";

import{
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,

  createPurchase,
  getPurchases,
  markPurchaseAsReceived,
  cancelPurchase,

  createStockIn,
  getStockIns,

  createStockOut,
  getStockOuts,

  getInventoryRecords,
} from "../controllers/inventoryController.js";
const router = express.Router();

// Products
router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Purchases
router.post("/purchases", createPurchase);
router.get("/purchases", getPurchases);
router.patch("/purchases/:id/receive", markPurchaseAsReceived);
router.patch("/purchases/:id/cancel", cancelPurchase);

// Stock In
router.post("/stock-in", createStockIn);
router.get("/stock-in", getStockIns);

// Stock Out
router.post("/stock-out", createStockOut);
router.get("/stock-out", getStockOuts);

router.get("/records", getInventoryRecords);

export default router;