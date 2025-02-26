const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

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
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL");
});

// User Signup (Now using bcrypt)
app.post('/signup', async (req, res) => {
    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const checkSql = "SELECT * FROM users WHERE username = ?";
        db.query(checkSql, [username], (err, results) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });

            if (results.length > 0) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const insertSql = "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)";
            db.query(insertSql, [username, phone, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ message: "Database error", error: err });

                return res.json({ message: "User registered successfully" });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "⚠️ Username and password are required" });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error("❌ Login error:", err);
            return res.status(500).json({ message: "An error occurred while logging in" });
        }

        if (results.length > 0) {
            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
                return res.json({ success: true, token, user_id: user.id });
            } else {
                return res.status(401).json({ message: "❌ Invalid username or password" });
            }
        } else {
            return res.status(401).json({ message: "❌ Invalid username or password" });
        }
    });
});

app.post('/cart/add', async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const { user_id, product_id, product_name, price, quantity, image_url } = req.body;

        if (!user_id || !product_id || !product_name || !price || !quantity || !image_url) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const total_amount = price * quantity;

        await db.promise().query(
            "INSERT INTO cart (user_id, product_id, product_name, price, quantity, image_url, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [user_id, product_id, product_name, price, quantity, image_url, total_amount]
        );

        res.status(200).json({ message: "Added to cart successfully" });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Database error", error: error.message });
    }
});
app.listen(8082, () => {
    console.log("🚀 Server is running on http://localhost:8082");
});
