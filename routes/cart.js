const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Middleware to check if user is logged in
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

// Add product to cart
router.post('/add', ensureAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const getCart = () => new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM carts WHERE user_id = ?';
        db.query(sql, [userId], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });

    const createCart = () => new Promise((resolve, reject) => {
        const sql = 'INSERT INTO carts (user_id) VALUES (?)';
        db.query(sql, [userId], (err, result) => {
            if (err) reject(err);
            resolve(result.insertId);
        });
    });

    const addItemToCart = (cartId) => {
        const sql = `
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (?, ?, 1)
        ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `;
        db.query(sql, [cartId, productId], (err) => {
            if (err) throw err;
            res.redirect('/cart');
        });
    };

    getCart()
        .then(cart => cart ? cart.id : createCart())
        .then(cartId => addItemToCart(cartId))
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});

// View cart
router.get('/', ensureAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    const getCartItems = () => new Promise((resolve, reject) => {
        const sql = `
        SELECT cart_items.id AS cart_item_id, products.*, cart_items.quantity
        FROM cart_items
        JOIN carts ON cart_items.cart_id = carts.id
        JOIN products ON cart_items.product_id = products.id
        WHERE carts.user_id = ?
        `;
        db.query(sql, [userId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });

    getCartItems()
        .then(items => {
            res.render('cart', { items });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
        });
});

// Remove item from cart
router.post('/remove', ensureAuthenticated, (req, res) => {
    const { itemId } = req.body;

    const sql = 'DELETE FROM cart_items WHERE id = ?';
    db.query(sql, [itemId], (err) => {
        if (err) throw err;
        res.redirect('/cart');
    });
});

// Update item quantity in cart
router.post('/update', ensureAuthenticated, (req, res) => {
    const { itemId, quantity } = req.body;

    const sql = 'UPDATE cart_items SET quantity = ? WHERE id = ?';
    db.query(sql, [quantity, itemId], (err) => {
        if (err) throw err;
        res.redirect('/cart');
    });
});

module.exports = router;
