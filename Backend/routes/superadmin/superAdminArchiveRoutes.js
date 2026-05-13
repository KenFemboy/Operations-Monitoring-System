import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
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
} from "../../controllers/archive/archiveController.js";

const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.get("/employees", getArchivedEmployees);
router.patch("/employees/:id/restore", restoreEmployee);

router.get("/sales", getArchivedSales);
router.patch("/sales/:id/restore", restoreSale);

router.get("/feedback", getArchivedFeedback);
router.patch("/feedback/:id/restore", restoreFeedback);

router.get("/inventory/products", getArchivedProducts);
router.patch("/inventory/products/:id/restore", restoreProduct);

router.get("/inventory/purchases", getArchivedPurchases);
router.patch("/inventory/purchases/:id/restore", restorePurchase);

router.get("/inventory/stock-in", getArchivedStockIns);
router.patch("/inventory/stock-in/:id/restore", restoreStockIn);

router.get("/inventory/stock-out", getArchivedStockOuts);
router.patch("/inventory/stock-out/:id/restore", restoreStockOut);

export default router;
