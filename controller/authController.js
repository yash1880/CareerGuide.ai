import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import {
    createGitHubAuthorizationUrl,
    getGitHubOAuthConfig,
    getGitHubProfile,
    matchesOAuthState
} from '../services/githubOAuth.js';
import { getJwtSecret } from '../services/jwtAuth.js';

const GITHUB_STATE_COOKIE = 'github_oauth_state';
const GITHUB_CALLBACK_PATH = '/auth/github/callback';

function getAuthCookieOptions(req) {
    return {
        httpOnly: true,
        sameSite: 'lax',
        secure: req.secure || process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    };
}

function renderLoginError(res, message) {
    return res.redirect(`/auth/login?message=${encodeURIComponent(message)}`);
}

function isGitHubSignInConfigured() {
    return Boolean(
        process.env.GITHUB_CLIENT_ID &&
        process.env.GITHUB_CLIENT_SECRET &&
        process.env.GITHUB_CALLBACK_URL &&
        process.env.JWT_SECRET?.length >= 32
    );
}

// Render Register Page
export const getRegisterPage = (req, res) => {
    res.render('auth/register');
};

// Render Login Page
export const getLoginPage = (req, res) => {
    res.render('auth/login', {
        error: typeof req.query.message === 'string' ? req.query.message : null,
        githubConfigured: isGitHubSignInConfigured()
    });
};

// Handle User Registration & Save to MongoDB
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('auth/register', { error: 'User already exists with this email!' });
        }

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user with exact form name input
        const newUser = new User({
            name: name ? name.trim() : "New User",
            email,
            password: hashedPassword
        });

        await newUser.save();
        
        // Redirect to login page after successful registration
        res.redirect('/auth/login');
    } catch (error) {
        console.error("Registration Error:", error);
        res.render('auth/register', { error: 'Server error, please try again.' });
    }
};

// Handle User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('auth/login', {
                error: 'Invalid email or password!',
                githubConfigured: isGitHubSignInConfigured()
            });
        }

        // Verify password
        const isMatch = typeof password === 'string' &&
            typeof user.password === 'string' &&
            await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', {
                error: 'Invalid email or password!',
                githubConfigured: isGitHubSignInConfigured()
            });
        }

        // Generate JWT Token and set cookie so protectDashboard middleware recognizes it
        const token = jwt.sign(
            { id: user._id }, 
            getJwtSecret(),
            { expiresIn: '7d' }
        );

        res.cookie('token', token, getAuthCookieOptions(req));

        // Redirect to dashboard on successful login
        res.redirect('/dashboard');
    } catch (error) {
        console.error("Login Error:", error);
        res.status(error.message.startsWith('JWT_SECRET') ? 503 : 500).render('auth/login', {
            error: error.message.startsWith('JWT_SECRET')
                ? 'Sign-in is not configured on this server. Please contact the administrator.'
                : 'Server error, please try again.',
            githubConfigured: isGitHubSignInConfigured()
        });
    }
};

export const startGitHubLogin = (req, res) => {
    try {
        const config = getGitHubOAuthConfig();
        getJwtSecret();
        const state = randomBytes(32).toString('hex');
        res.cookie(GITHUB_STATE_COOKIE, state, {
            httpOnly: true,
            sameSite: 'lax',
            secure: req.secure || process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000,
            path: GITHUB_CALLBACK_PATH
        });
        return res.redirect(createGitHubAuthorizationUrl(state, config));
    } catch (error) {
        console.error('GitHub sign-in configuration error:', error.message);
        return renderLoginError(res, 'GitHub sign-in is not configured yet.');
    }
};

export const completeGitHubLogin = async (req, res) => {
    const clearStateCookie = () => res.clearCookie(GITHUB_STATE_COOKIE, {
        httpOnly: true,
        sameSite: 'lax',
        secure: req.secure || process.env.NODE_ENV === 'production',
        path: GITHUB_CALLBACK_PATH
    });

    try {
        if (req.query.error) {
            clearStateCookie();
            return renderLoginError(res, 'GitHub sign-in was cancelled.');
        }

        const code = typeof req.query.code === 'string' ? req.query.code : '';
        const state = typeof req.query.state === 'string' ? req.query.state : '';
        const savedState = req.cookies?.[GITHUB_STATE_COOKIE];
        if (!code || !matchesOAuthState(savedState, state)) {
            clearStateCookie();
            return renderLoginError(res, 'GitHub sign-in could not be verified. Please try again.');
        }
        clearStateCookie();

        const jwtSecret = getJwtSecret();
        const profile = await getGitHubProfile(code, getGitHubOAuthConfig());
        let user = await User.findOne({ githubId: profile.githubId });
        if (!user) {
            const escapedEmail = profile.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const existingEmailUser = await User.findOne({
                email: { $regex: `^${escapedEmail}$`, $options: 'i' }
            });
            if (existingEmailUser) {
                return renderLoginError(res, 'This email already has an account. Sign in with your password instead.');
            }

            user = new User({
                name: profile.name,
                email: profile.email,
                githubId: profile.githubId,
                profileImage: profile.profileImage
            });
            try {
                await user.save();
            } catch (error) {
                if (error.code !== 11000) throw error;
                user = await User.findOne({ githubId: profile.githubId });
                if (!user) {
                    return renderLoginError(res, 'This email already has an account. Sign in with your password instead.');
                }
            }
        }

        const token = jwt.sign(
            { id: user._id },
            jwtSecret,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, getAuthCookieOptions(req));
        return res.redirect('/dashboard');
    } catch (error) {
        console.error('GitHub sign-in failed:', error.message);
        const message = error.message.startsWith('JWT_SECRET')
            ? 'Sign-in is not configured on this server. Please contact the administrator.'
            : 'GitHub sign-in failed. Please try again.';
        return renderLoginError(res, message);
    }
};