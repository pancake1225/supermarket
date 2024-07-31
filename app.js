const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/db');
const authRoutes = require('./public/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Flash Messages Middleware
app.use(flash());

// Global Flash Messages and User Session
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    next();
});

// Use auth routes, product routes, category routes, cart routes, and admin routes
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);

// Route to render the home page
app.get('/', (req, res) => {
    const getProducts = () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });

    const getCategories = () => new Promise((resolve, reject) => {
        db.query('SELECT * FROM categories', (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });

    Promise.all([getProducts(), getCategories()])
        .then(([products, categories]) => {
            res.render('index', { products, categories });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});

// Route to render the about page
app.get('/about', (req, res) => {
    const user = req.session.user;
    res.render('about', { user });
});

// Route to render the profile page
app.get('/profile', (req, res) => {
    const user = req.session.user;
    res.render('profile', { user });
});

app.post('/profile/update', (req, res) => {
    const { username, preferences } = req.body;
    res.redirect('/profile');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
