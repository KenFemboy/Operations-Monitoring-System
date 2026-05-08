import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createSale,
  getSales,
  getDailySales,
  getMonthlySales,
  deleteSale,
} from "../controllers/saleController.js";

const router = express.Router();

router.use(protect);

router.post("/", allowRoles("superadmin", "admin"), createSale);

router.get("/", allowRoles("superadmin", "admin", "console_user"), getSales);

router.get("/daily", allowRoles("superadmin", "admin", "console_user"), getDailySales);

router.get("/monthly", allowRoles("superadmin", "admin", "console_user"), getMonthlySales);

router.delete("/:id", allowRoles("superadmin", "admin"), deleteSale);

export default router;