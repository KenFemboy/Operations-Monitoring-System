import express from 'express';
import * as branchController from '../controllers/branchController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.post('/create', branchController.createBranch);
router.put('/:branchId', branchController.updateBranchById);
router.delete('/:branchId', authMiddleware, branchController.deleteBranchById);
router.get('/get-all', branchController.getBranches);
router.get('/get-by-location/:location', branchController.getBranchesByLocation);
router.get('/my-branch', authMiddleware, branchController.getMyBranch);
router.put('/my-branch', authMiddleware, branchController.updateMyBranch);
export default router;
