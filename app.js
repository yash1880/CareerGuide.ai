import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';

// Routes Import
import authRoutes from './routes/authRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { getDashboard } from './controller/userController.js';

// Auth Middleware Import (requireAuth aur optionalAuth dono import kar liye)
import { requireAuth, optionalAuth } from './middleware/authMiddleware.js';

// Error Handling Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 1. PUBLIC ROUTES (Bina login ke chalenge)
// ==========================================
// Yahan requireAuth ki jagah optionalAuth lagaya hai taaki home page sabke liye khule
app.get('/', optionalAuth, (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/about', optionalAuth, (req, res) => {
    res.render('about', { user: req.user, path: '/about' });
});

// Auth routes public rahenge taaki user login/register kar sake
app.use('/auth', authRoutes);


// ==========================================
// 2. PROTECTED ROUTES (In sabke liye login zaroori hai)
// ==========================================

// Dashboard Route
app.get('/dashboard', requireAuth, getDashboard);

// Baaki saare feature routes par 'requireAuth' middleware apply kar diya hai
app.use('/careers', requireAuth, careerRoutes);
app.use('/resume-ats', requireAuth, resumeRoutes);
app.use('/ai', requireAuth, aiRoutes);
app.use('/assessment', requireAuth, assessmentRoutes);
app.use('/jobs', requireAuth, jobRoutes);
app.use('/users', requireAuth, userRoutes);
app.use('/skills', requireAuth, skillRoutes);
app.use('/roadmap', requireAuth, roadmapRoutes);
app.use('/internships', requireAuth, internshipRoutes);
app.use('/applications', requireAuth, applicationRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
});