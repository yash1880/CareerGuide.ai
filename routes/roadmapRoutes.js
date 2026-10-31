import express from 'express';
import { getRoadmapPage, generateRoadmap } from '../controller/roadmapController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getRoadmapPage);
router.get('/:roadmapId', requireAuth, getRoadmapPage);
router.post('/generate', requireAuth, generateRoadmap);

export default router;
