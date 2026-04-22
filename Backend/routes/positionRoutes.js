import express from "express";
import * as positionController from "../controllers/positionController.js";

const router = express.Router();

router.post("/create", positionController.createPosition);
router.get("/get-all", positionController.getPositions);

export default router;
