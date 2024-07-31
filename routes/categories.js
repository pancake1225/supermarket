const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get all products by category ID
router.get('/:id/products', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE category_id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = router;
