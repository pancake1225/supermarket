const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get a single product by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Create a new product
router.post('/', (req, res) => {
    const { name, price, category_id, image } = req.body;
    const sql = 'INSERT INTO products (name, price, category_id, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, price, category_id, image], (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId });
    });
});

// Update a product by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category_id, image } = req.body;
    const sql = 'UPDATE products SET name = ?, price = ?, category_id = ?, image = ? WHERE id = ?';
    db.query(sql, [name, price, category_id, image, id], (err) => {
        if (err) throw err;
        res.status(200).json({ message: 'Product updated' });
    });
});

// Delete a product by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.status(200).json({ message: 'Product deleted' });
    });
});

module.exports = router;
