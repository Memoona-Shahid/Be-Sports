const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET Login Page
router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Admin Login', layout: 'layouts/default-layout' });
});

// POST Login Handle
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        // Use bcrypt.compare to check the hashed password
        if (user && await bcrypt.compare(password, user.password)) {
            
            // IMPORTANT: Save the whole user object (or at least name/role) 
            // so your header.ejs can see "user.name" and "user.role"
            req.session.user = {
                id: user._id,
                name: user.name,
                role: user.role
            };

            req.flash('success', `Welcome back, ${user.name}!`);
            
            // Redirect based on role
            if (user.role === 'admin') {
                return res.redirect('/admin');
            }
            return res.redirect('/');
        }
        
        req.flash('error', 'Invalid email or password');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET Register Page
router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' }); 
});

// POST Register Handle (NOW SENDING DATA TO DB)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            req.flash('error', 'Email is already registered.');
            return res.redirect('/auth/register');
        }

        // 2. Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the new user record
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user' // Default new signups to 'user'
        });

        // 4. Save to MongoDB
        await newUser.save();

        // 5. Success! Send them to login
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/auth/login');

    } catch (err) {
        console.error("Registration Error:", err);
        req.flash('error', 'An error occurred during registration.');
        res.redirect('/auth/register');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/auth/login');
    });
});

module.exports = router;