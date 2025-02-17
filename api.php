<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $product_id = $_GET['id'];
    $sql = "SELECT * FROM products WHERE product_id = '$product_id'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        echo json_encode($product);
    } else {
        echo json_encode(['message' => 'Product not found']);
    }
}


// Handle POST request to add a product
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Sanitize inputs
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $category = $conn->real_escape_string($data['category']);

    // Insert new product into the database
    $sql = "INSERT INTO products (product_id, product_name, product_category) 
            VALUES ('$id', '$name', '$category')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Product added successfully!']);
    } else {
        echo json_encode(['message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>
