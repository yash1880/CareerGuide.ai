import express from 'express';
import { getAllCareers, getCareerById, createCareer } from '../controller/careerController.js';

const router = express.Router();

// Routes mapped relative to /careers prefix in app.js
router.get('/', getAllCareers);
router.get('/:id', getCareerById);
router.post('/', createCareer);

export default router;