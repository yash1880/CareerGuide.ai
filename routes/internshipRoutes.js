import express from 'express';
import { getInternshipsPage, postInternship } from '../controller/internshipController.js';

const router = express.Router();
router.get('/', getInternshipsPage);
router.post('/api/internships', postInternship);

export default router;