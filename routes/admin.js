const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Middleware to check if user is an admin
const ensureAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    } else {
        res.redirect('/login');
    }
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Admin dashboard
router.get('/', ensureAdmin, (req, res) => {
    res.render('admin/dashboard');
});

// View all products
router.get('/products', ensureAdmin, (req, res) => {
    const sql = 'SELECT products.*, categories.name AS category_name FROM products JOIN categories ON products.category_id = categories.id';
    db.query(sql, (err, products) => {
        if (err) throw err;
        res.render('admin/products', { products });
    });
});

// Add new product form
router.get('/products/new', ensureAdmin, (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, categories) => {
        if (err) throw err;
        res.render('admin/newProduct', { categories });
    });
});

// Create new product
router.post('/products', ensureAdmin, upload.single('image'), (req, res) => {
    const { name, price, category_id } = req.body;
    const image = `/uploads/${req.file.filename}`;
    const sql = 'INSERT INTO products (name, price, category_id, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, price, category_id, image], (err) => {
        if (err) throw err;
        res.redirect('/admin/products');
    });
});

// Edit product form
router.get('/products/edit/:id', ensureAdmin, (req, res) => {
    const productId = req.params.id;
    const getProduct = () => new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM products WHERE id = ?';
        db.query(sql, [productId], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });

    const getCategories = () => new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM categories';
        db.query(sql, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });

    Promise.all([getProduct(), getCategories()])
        .then(([product, categories]) => {
            res.render('admin/editProduct', { product, categories });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});

// Update product
router.post('/products/edit/:id', ensureAdmin, upload.single('image'), (req, res) => {
    const productId = req.params.id;
    const { name, price, category_id } = req.body;
    let sql;
    let params;

    if (req.file) {
        const image = `/uploads/${req.file.filename}`;
        sql = 'UPDATE products SET name = ?, price = ?, category_id = ?, image = ? WHERE id = ?';
        params = [name, price, category_id, image, productId];
    } else {
        sql = 'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?';
        params = [name, price, category_id, productId];
    }

    db.query(sql, params, (err) => {
        if (err) throw err;
        res.redirect('/admin/products');
    });
});

// Delete product
router.post('/products/delete/:id', ensureAdmin, (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [productId], (err) => {
        if (err) throw err;
        res.redirect('/admin/products');
    });
});

module.exports = router;
