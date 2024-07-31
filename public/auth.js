const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form submission
// Handle login form submission
// Handle login form submission
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.is_admin // Assuming `is_admin` is a boolean column in the users table
                    };
                    req.flash('success_msg', 'You are logged in');
                    res.redirect('/');
                } else {
                    req.flash('error_msg', 'Incorrect password');
                    res.redirect('/login');
                }
            });
        } else {
            req.flash('error_msg', 'No user found with this email');
            res.redirect('/login');
        }
    });
});



// Render signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Handle signup form submission
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.flash('error_msg', 'Email already registered');
            res.redirect('/signup');
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;
                db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], (err, results) => {
                    if (err) throw err;
                    req.flash('success_msg', 'You are now registered and can log in');
                    res.redirect('/login');
                });
            });
        }
    });
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/');
    });
});

module.exports = router;
