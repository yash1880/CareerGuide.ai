import express from 'express';
import multer from 'multer';
import { getAtsPage, scanResume } from '../controller/atsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET /resume-ats
router.get('/', requireAuth, getAtsPage);

router.post('/scan', requireAuth, upload.single('resume'), scanResume);

router.use((error, req, res, next) => {
    if (!error) {
        return next();
    }

    if (error instanceof multer.MulterError) {
        const isTooLarge = error.code === 'LIMIT_FILE_SIZE';
        const message = isTooLarge
            ? 'The resume file must be 5 MB or smaller.'
            : 'Please upload a PDF or DOCX resume.';
        return res.status(isTooLarge ? 413 : 400).render('resume-ats', {
            user: req.user,
            path: '/resume-ats',
            result: null,
            error: message,
            jobDescription: req.body?.jobDescription || '',
            selectedJobRole: req.body?.jobRole || ''
        });
    }

    console.error('Resume upload failed:', error);
    return res.status(500).render('resume-ats', {
        user: req.user,
        path: '/resume-ats',
        result: null,
        error: 'The resume could not be uploaded. Please try again.',
        jobDescription: req.body?.jobDescription || '',
        selectedJobRole: req.body?.jobRole || ''
    });
});

export default router;