const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Error connecting to MySQL:", err);
        return;
    }
    console.log("✅ Connected to MySQL");
});

// ✅ Default Routes
app.get('/', (req, res) => res.send("BACKEND API"));
app.get('/signup', (req, res) => res.send("BACKEND API"));
app.get('/profile', (req, res) => res.send("BACKEND API"));
app.get('/login', (req, res) => res.send("BACKEND API"));

// ✅ Fetch All Products
app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching products:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

// ✅ User Signup
app.post('/signup', (req, res) => {
    console.log("📥 Received signup request:", req.body);

    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
        return res.status(400).json({ message: "⚠️ All fields are required" });
    }

    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "⚠️ Username already exists. Try another one." });
        }

        const insertSql = "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)";
        db.query(insertSql, [username, phone, password], (err, result) => {
            if (err) {
                console.error("❌ Insert error:", err);
                return res.status(500).json({ message: "Database error", error: err });
            }
            console.log("✅ User registered successfully:", { id: result.insertId, username, phone });
            return res.json({ message: "✅ User registered successfully" });
        });
    });
});

// ✅ User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "⚠️ Username and password are required" });
    }

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error("❌ Login error:", err);
            return res.status(500).json({ message: "An error occurred while logging in" });
        }

        if (results.length > 0) {
            const user = results[0];
            return res.json({ success: true, user: { id: user.id, username: user.username } });
        } else {
            return res.status(401).json({ message: "❌ Invalid username or password" });
        }
    });
});

// ✅ Add to Cart (No Admin Panel)
app.post('/add-to-cart', (req, res) => {
    const { user_id, product_id, name, price, image } = req.body;

    if (!user_id || !product_id || !name || !price || !image) {
        return res.status(400).json({ message: "⚠️ All fields are required" });
    }

    const sql = 'INSERT INTO cart (user_id, product_id, name, price, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user_id, product_id, name, price, image], (err, result) => {
        if (err) {
            console.error("❌ Error adding to cart:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.json({ message: "✅ Product added to cart successfully" });
    });
});

// ✅ Fetch Cart Items for User
app.get('/cart/:user_id', (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "⚠️ User ID is required" });
    }

    const sql = "SELECT * FROM cart WHERE user_id = ?";
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("❌ Error fetching cart:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

// ✅ Remove Item from Cart
app.delete('/cart/:user_id/:product_id', (req, res) => {
    const { user_id, product_id } = req.params;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: "⚠️ User ID and Product ID are required" });
    }

    const sql = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
    db.query(sql, [user_id, product_id], (err, result) => {
        if (err) {
            console.error("❌ Error removing from cart:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.json({ message: "✅ Product removed from cart" });
    });
});

// ✅ Clear Cart for User
app.delete('/cart/:user_id', (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ message: "⚠️ User ID is required" });
    }

    const sql = "DELETE FROM cart WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error("❌ Error clearing cart:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        return res.json({ message: "✅ Cart cleared successfully" });
    });
});

app.listen(8082, () => {
    console.log("🚀 Server is running on http://localhost:8082");
});
