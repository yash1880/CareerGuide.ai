import express from 'express';
import {
    applyPosition,
    getApplicationDetail,
    getApplicationsPage
} from '../controller/applicationController.js';

const router = express.Router();
router.get('/', getApplicationsPage);
router.get('/view/:id', getApplicationDetail);
router.post('/api/apply', applyPosition);

export default router;