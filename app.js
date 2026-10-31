import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import ejs from 'ejs';
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

// Auth Middleware Import
import { requireAuth, optionalAuth } from './middleware/authMiddleware.js';

// Error Handling Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vercel proxy ke peeche chalta hai (cookies/HTTPS ke liye zaroori)
app.set('trust proxy', 1);

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine (ejs explicitly register kiya taaki Vercel bundle me include ho)
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection (har request pe cached connection use hoga)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection error:', err);
        next(err);
    }
});

// ==========================================
// 1. PUBLIC ROUTES (Bina login ke chalenge)
// ==========================================
app.get('/', optionalAuth, (req, res) => {
    res.render('home', { user: req.user });
});

app.get('/about', optionalAuth, (req, res) => {
    res.render('about', { user: req.user, path: '/about' });
});

app.use('/auth', authRoutes);

// ==========================================
// 2. PROTECTED ROUTES (Login zaroori hai)
// ==========================================
app.get('/dashboard', requireAuth, getDashboard);

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

// Sirf local me listen karo, Vercel pe nahi
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
    });
}

// Vercel ke liye export (zaroori)
export default app;