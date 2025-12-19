// middleware/auth.js
module.exports = (req, res, next) => {
    // FIX: Check for req.session.user and then the role inside it
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    
    // If not admin, send back to login
    res.redirect('/auth/login'); 
};