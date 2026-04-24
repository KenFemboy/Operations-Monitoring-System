import express from 'express';
import * as branchController from '../controllers/branchController.js';

const router = express.Router();
router.post('/create', branchController.createBranch);
router.get('/get-all', branchController.getBranches);
router.get('/get-by-location/:location', branchController.getBranchesByLocation);
export default router;