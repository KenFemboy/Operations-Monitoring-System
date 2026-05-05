import express from "express";

import {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch,
} from "../controllers/branchController.js";

const router = express.Router();

router.post("/", createBranch);
router.get("/", getBranches);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

export default router;