import express from 'express';
import { getAssessmentPage, submitAssessment } from '../controller/assessmentController.js';

const router = express.Router();
router.get('/assessment', getAssessmentPage);
router.post('/api/assessment/submit', submitAssessment);

export default router;