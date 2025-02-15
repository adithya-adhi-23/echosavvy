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


app.post('/signup', (req, res) => {
    console.log("📥 Received signup request:", req.body); // ✅ Log request data

    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
        console.log("⚠️ Missing fields:", { username, phone, password }); // ✅ Debug missing fields
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if username exists
    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [username], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (results.length > 0) {
            console.log("⚠️ Username already exists:", username);
            return res.status(400).json({ message: "Username already exists. Try another one." });
        }

        // Insert new user
        const insertSql = "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)";
        db.query(insertSql, [username, phone, password], (err, result) => {
            if (err) {
                console.error("❌ Insert error:", err);
                return res.status(500).json({ message: "Database error", error: err });
            }
            console.log("✅ User registered successfully:", { id: result.insertId, username, phone });
            return res.json({ message: "User registered successfully" });
        });
    });
});



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



app.listen(8082, () => {
    console.log("🚀 Server is running on http://localhost:8082");
});
