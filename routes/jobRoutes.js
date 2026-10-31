import express from 'express';
import { getJobDetail, getJobsPage } from '../controller/jobController.js';

const router = express.Router();

// Route: GET /jobs
router.get('/', getJobsPage);
router.get('/:id', getJobDetail);

export default router;