<?php
include 'db.php';

// Fetch all products from the database
$sql = "SELECT * FROM products";
$result = $conn->query($sql);

$products = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row; // Add each product to the array
    }
}

echo json_encode($products); // Return the product data as JSON
$conn->close();
?>
