import express from "express";
import { getArchiveEntries, restoreArchiveEntry, clearArchive } from "../controllers/archiveController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("superadmin", "admin"), getArchiveEntries);
router.post("/:entryId/restore", protect, allowRoles("superadmin"), restoreArchiveEntry);
router.post("/clear-all", protect, allowRoles("superadmin"), clearArchive);

export default router;