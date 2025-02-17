// Handle form submission to add products
document.getElementById('submit').addEventListener('click', () => {
    const id = document.getElementById('productid').value;
    const name = document.getElementById('productname').value;
    const category = document.getElementById('productcategory').value;

    // Ensure the form fields are not empty
    if (!id || !name || !category) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('http://localhost/ecommerce/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, category })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || 'Product added successfully!');
            // Optionally, you can clear the form fields after submission
            document.getElementById('productid').value = '';
            document.getElementById('productname').value = '';
            document.getElementById('productcategory').value = '';
        })
        .catch(error => console.error('Error:', error));
});
