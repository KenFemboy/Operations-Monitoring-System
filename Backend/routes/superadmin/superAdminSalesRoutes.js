import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import { branchScopeMiddleware } from "../../middleware/branchScopeMiddleware.js";
import {
  createSale,
  getSales,
  getDailySales,
  getMonthlySales,
  deleteSale,
} from "../../controllers/sales/saleController.js";

// Superadmin sales routes. Accessible by superadmin across all branches.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"), branchScopeMiddleware);

router.post("/", createSale);
router.get("/", getSales);
router.get("/daily", getDailySales);
router.get("/monthly", getMonthlySales);
router.delete("/:id", deleteSale);

export default router;
