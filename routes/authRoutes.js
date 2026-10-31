import express from 'express';
import {
    completeGitHubLogin,
    getLoginPage,
    getRegisterPage,
    loginUser,
    registerUser,
    startGitHubLogin
} from '../controller/authController.js';

const router = express.Router();

// GET Routes for rendering Login and Register views
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);
router.get('/github', startGitHubLogin);
router.get('/github/callback', completeGitHubLogin);

// POST Routes for handling database saving and authentication
router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

export default router;