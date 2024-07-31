const db = require('./db');

const insertCategories = () => {
    const categories = [
        { name: 'Drinks' },
        { name: 'Bakery' },
        { name: 'Meat' },
        { name: 'Electronics' },
        { name: 'Fruits & Vegetables' },
        { name: 'Toys' }
    ];

    categories.forEach(category => {
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        db.query(sql, [category.name], (err, result) => {
            if (err) throw err;
            console.log(`Inserted category: ${category.name}`);
        });
    });
};

insertCategories();
