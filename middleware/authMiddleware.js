import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getJwtSecret } from '../services/jwtAuth.js';

export const requireAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    const handleUnauthorized = (message) => {
        if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html'))) {
            return res.status(401).json({ success: false, message });
        }
        return res.redirect('/auth/login?message=' + encodeURIComponent(message));
    };

    if (!token) {
        return handleUnauthorized('Please first login to access this page');
    }

    const jwtSecret = getJwtSecret();
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return handleUnauthorized('User not found, please login again');
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return handleUnauthorized('Session expired, please login again');
    }
};

// YEH WALA FUNCTION MISSING THA, ISE ADD KAR LE:
export const optionalAuth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        const secret = getJwtSecret();
        try {
            const decoded = jwt.verify(token, secret);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

// Alias for compatibility
export const protect = requireAuth;