import express from 'express';
import { addSkill } from '../controller/skillController.js';
import {
    analyzeSkillGap,
    getSkillGapAnalysis,
    getSkillGapHistory,
    getSkillGapPage,
    updateSkillGapProgress
} from '../controller/skillGapController.js';

const router = express.Router();

router.get('/', getSkillGapPage);
router.post('/analyze', analyzeSkillGap);
router.get('/history', getSkillGapHistory);
router.post('/:id/progress', updateSkillGapProgress);
router.get('/:id', getSkillGapAnalysis);
router.post('/api/skills', addSkill);

export default router;