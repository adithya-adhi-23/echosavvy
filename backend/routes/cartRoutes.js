const express = require("express");
const router = express.Router();
const db = require("../db"); 


router.post("/add", (req, res) => {
    const { product_id, product_name, price, image_url } = req.body;

    const query = `
        INSERT INTO cart (product_id, product_name, price, image_url, quantity)
        VALUES (?, ?, ?, ?, 1)
        ON DUPLICATE KEY UPDATE quantity = quantity + 1;
    `;

    db.query(query, [product_id, product_name, price, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product added to cart successfully" });
    });
});

router.get('/', (req, res) => {
    const sql = "SELECT * FROM cart";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching cart:", err);
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.json(results);
    });
});

router.delete("/remove/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product removed from cart" });
    });
});

// Clear entire cart
router.delete("/clear", (req, res) => {
    db.query("DELETE FROM cart", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cart cleared successfully" });
    });
});
router.get('/cart', (req, res) => {
    res.send("Cart API is working!");
});

router.get('/cart/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const sql = "SELECT * FROM cart WHERE user_id = ?";
        const [results] = await db.execute(sql, [user_id]); // Use .execute() instead of .query()
        res.json(results);
    } catch (err) {
        console.error("❌ Error fetching cart:", err);
        res.status(500).json({ message: "Database error", error: err });
    }
});


module.exports = router; 

