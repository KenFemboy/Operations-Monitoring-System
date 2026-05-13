import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  archivePurchase,
  archiveStockIn,
  archiveStockOut,
} from "../../controllers/archive/archiveController.js";
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

// Admin inventory routes. Accessible by admin/console_user for assigned branch only.
const router = express.Router();

router.use(protect, allowRoles("admin", "console_user"), branchScopeMiddleware);

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.patch("/products/:id/archive", deleteProduct);
router.delete("/products/:id", deleteProduct);

router.post("/purchases", createPurchase);
router.get("/purchases", getPurchases);
router.patch("/purchases/:id/receive", markPurchaseAsReceived);
router.patch("/purchases/:id/cancel", cancelPurchase);
router.patch("/purchases/:id/archive", archivePurchase);

router.post("/stock-in", createStockIn);
router.get("/stock-in", getStockIns);
router.patch("/stock-in/:id/archive", archiveStockIn);

router.post("/stock-out", createStockOut);
router.get("/stock-out", getStockOuts);
router.patch("/stock-out/:id/archive", archiveStockOut);

router.get("/records", getInventoryRecords);

export default router;
