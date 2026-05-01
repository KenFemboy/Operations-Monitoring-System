import express from "express";

import {
  createSale,
  getSales,
  getDailySales,
  getMonthlySales,
  deleteSale,
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/", createSale);

router.get("/", getSales);

router.get("/daily", getDailySales);

router.get("/monthly", getMonthlySales);

router.delete("/:id", deleteSale);

export default router;