<?php
include 'db.php'; 
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h1>Available Products</h1>";
    echo "<div style='display: flex; flex-wrap: wrap;'>";

    while ($row = $result->fetch_assoc()) {
        echo "
        <div style='border: 1px solid #ccc; margin: 10px; padding: 10px; width: 200px;'>
            <h2>" . htmlspecialchars($row['product_name']) . "</h2>
            <p><strong>Category:</strong> " . htmlspecialchars($row['product_category']) . "</p>
            <p><strong>Product ID:</strong> " . htmlspecialchars($row['product_id']) . "</p>
        </div>
        ";
    }

    echo "</div>";
} else {
    echo "<p>No products available.</p>";
}

$conn->close();
?>
