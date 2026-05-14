import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { allowRoles } from "../../middleware/roleMiddleware.js";
import {
  clearArchive,
  getArchiveEntries,
  restoreArchiveEntry,
} from "../../controllers/hr/archiveController.js";

// Superadmin branch/admin archive routes. Accessible by superadmin only.
const router = express.Router();

router.use(protect, allowRoles("super_admin", "superadmin"));

router.get("/archive", getArchiveEntries);
router.post("/archive/:entryId/restore", restoreArchiveEntry);
router.post("/archive/clear-all", clearArchive);

export default router;
