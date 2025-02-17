<?php
include 'db.php';  // This includes the database connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the data from the request body (JSON)
    $data = json_decode(file_get_contents('php://input'), true);

    // Sanitize and escape the input data to prevent SQL injection
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $category = $conn->real_escape_string($data['category']);
    $price = $conn->real_escape_string($data['price']);
    $stock = $conn->real_escape_string($data['stock']);

    // Insert the product into the database
    $sql = "INSERT INTO products (product_id, product_name, product_category, product_price, product_stock)
            VALUES ('$id', '$name', '$category', '$price', '$stock')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Product added successfully!']);
    } else {
        echo json_encode(['message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>
