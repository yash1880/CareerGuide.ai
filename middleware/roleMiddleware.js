export const requireRole = (...roles) => {
    return (req, res, next) => {
        // Agar user exist nahi karta ya uska role allowed roles mein nahi hai
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` 
            });
        }
        next();
    };
};