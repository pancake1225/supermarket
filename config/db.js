const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'mysql-jimi.alwaysdata.net',
    user: 'jimi',
    port: 3306,
    password: 'jimi1225!',
    database: 'jimi_supermarket'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

const createUsersTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Users table created or already exists...');
    });
};

const createCategoriesTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Categories table created or already exists...');
    });
};

const createProductsTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category_id INT NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
    )`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Products table created or already exists...');
    });
};

const createCartsTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Carts table created or already exists...');
    });
};

const createCartItemsTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES carts(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    )`;

    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Cart Items table created or already exists...');
    });
};

const initializeDatabase = () => {
    createUsersTable();
    createCategoriesTable();
    createProductsTable();
    createCartsTable();
    createCartItemsTable();
};

if (require.main === module) {
    initializeDatabase();
}

module.exports = db;
