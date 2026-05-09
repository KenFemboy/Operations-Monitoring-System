import express from "express";
import publicFeedbackRoutes from "./publicFeedbackRoutes.js";

// Public API group. Only customer-facing actions belong here.
const router = express.Router();

router.use("/feedback", publicFeedbackRoutes);

export default router;
