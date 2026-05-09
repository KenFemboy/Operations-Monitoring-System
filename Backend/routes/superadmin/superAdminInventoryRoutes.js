import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
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
} from "../../controllers/inventory/inventoryController.js";

// Superadmin inventory routes. Accessible by superadmin across all branches.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.post("/purchases", createPurchase);
router.get("/purchases", getPurchases);
router.patch("/purchases/:id/receive", markPurchaseAsReceived);
router.patch("/purchases/:id/cancel", cancelPurchase);

router.post("/stock-in", createStockIn);
router.get("/stock-in", getStockIns);

router.post("/stock-out", createStockOut);
router.get("/stock-out", getStockOuts);

router.get("/records", getInventoryRecords);

export default router;
