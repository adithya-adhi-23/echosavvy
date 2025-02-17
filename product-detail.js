
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch product details
fetch(`http://localhost/ecommerce/api.php?id=${productId}`)
    .then(response => response.json())
    .then(data => {
        const productDetailContainer = document.getElementById('product-detail');
        productDetailContainer.innerHTML = `
            <h2>${data.product_name}</h2>
            <p><strong>Category:</strong> ${data.product_category}</p>
            <p><strong>Product ID:</strong> ${data.product_id}</p>
            <!-- Add other details like price, stock, etc. -->
        `;
    })
    .catch(error => console.error('Error:', error));
