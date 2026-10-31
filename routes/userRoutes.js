import express from 'express';
import { getUserProfile, updateUserProfile, getDashboard } from '../controller/userController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { upload } from '../config/upload.js'; // <-- Yahan path change kar diya

const router = express.Router();

router.get('/dashboard', requireAuth, getDashboard);
router.get('/profile', requireAuth, getUserProfile);

router.post('/profile/update', requireAuth, upload.single('profileImage'), updateUserProfile);
router.put('/api/profile/update', requireAuth, upload.single('profileImage'), updateUserProfile);

export default router;