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

// Admin sales routes. Accessible by admin/console_user for assigned branch only.
const router = express.Router();

router.use(protect, allowRoles("admin", "console_user"), branchScopeMiddleware);

router.post("/", createSale);
router.get("/", getSales);
router.get("/daily", getDailySales);
router.get("/monthly", getMonthlySales);
router.patch("/:id/archive", deleteSale);
router.delete("/:id", deleteSale);

export default router;
