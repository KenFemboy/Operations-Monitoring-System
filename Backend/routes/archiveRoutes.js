import express from "express";
import { getArchiveEntries, restoreArchiveEntry, clearArchive } from "../controllers/archiveController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getArchiveEntries);
router.post("/:entryId/restore", authMiddleware, restoreArchiveEntry);
router.post("/clear-all", authMiddleware, clearArchive);

export default router;