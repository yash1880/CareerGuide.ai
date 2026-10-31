import express from 'express';
import { getAICounselorPage, handleAIQuery } from '../controller/aiController.js';
import {
    compareInterviewAttempts,
    completeInterview,
    getInterviewHistory,
    getInterviewReport,
    getInterviewSession,
    getInterviewImprovementTracker,
    getInterviewTrackerDetail,
    getMockInterviewPage,
    rateInterviewAnswer,
    startInterview,
    submitInterviewAnswer
} from '../controller/mockInterviewController.js';

const router = express.Router();
router.get('/counselor', getAICounselorPage);
router.get('/mock-interview/tracker/compare', compareInterviewAttempts);
router.get('/mock-interview/tracker/:id', getInterviewTrackerDetail);
router.get('/mock-interview/tracker', getInterviewImprovementTracker);
router.get('/mock-interview/history', getInterviewHistory);
router.get('/mock-interview/:id/report', getInterviewReport);
router.get('/mock-interview/:id', getInterviewSession);
router.post('/mock-interview/start', startInterview);
router.post('/mock-interview/:id/answer', submitInterviewAnswer);
router.post('/mock-interview/:id/rate', rateInterviewAnswer);
router.post('/mock-interview/:id/complete', completeInterview);
router.get('/mock-interview', getMockInterviewPage);
router.post('/api/ai/chat', handleAIQuery);

export default router;