import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

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

router.use(protect);

// Products
router.post("/products", allowRoles("superadmin", "admin"), createProduct);
router.get("/products", allowRoles("superadmin", "admin", "console_user"), getProducts);
router.get("/products/:id", allowRoles("superadmin", "admin", "console_user"), getProductById);
router.put("/products/:id", allowRoles("superadmin", "admin"), updateProduct);
router.delete("/products/:id", allowRoles("superadmin", "admin"), deleteProduct);

// Purchases
router.post("/purchases", allowRoles("superadmin", "admin"), createPurchase);
router.get("/purchases", allowRoles("superadmin", "admin", "console_user"), getPurchases);
router.patch("/purchases/:id/receive", allowRoles("superadmin", "admin"), markPurchaseAsReceived);
router.patch("/purchases/:id/cancel", allowRoles("superadmin", "admin"), cancelPurchase);

// Stock In
router.post("/stock-in", allowRoles("superadmin", "admin"), createStockIn);
router.get("/stock-in", allowRoles("superadmin", "admin", "console_user"), getStockIns);

// Stock Out
router.post("/stock-out", allowRoles("superadmin", "admin"), createStockOut);
router.get("/stock-out", allowRoles("superadmin", "admin", "console_user"), getStockOuts);

router.get("/records", allowRoles("superadmin", "admin", "console_user"), getInventoryRecords);

export default router;