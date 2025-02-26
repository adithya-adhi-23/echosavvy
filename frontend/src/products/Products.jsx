import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TiShoppingCart } from "react-icons/ti";
import { IoHome } from "react-icons/io5"; // Import the home icon
import styles from "./Products.module.css";

const products = [
  { id: 1, name: "Smartphone", category: "Mobile Phones", price: "$699.99", description: "Latest model with high-resolution camera and fast processor.", image: "src/image/phone.png" },
  { id: 2, name: "Laptop", category: "Computers", price: "$999.99", description: "Powerful laptop with 16GB RAM and 512GB SSD.", image: "src/image/laptop.jpeg" },
  { id: 3, name: "Tablet", category: "Tablets", price: "$399.99", description: "Lightweight tablet with a stunning display and long battery life.", image: "src/image/tab.avif" },
  { id: 4, name: "Smartwatch", category: "Wearables", price: "$199.99", description: "Track your fitness and receive notifications on the go.", image: "src/image/fit.jpg" },
  { id: 5, name: "Wireless Headphones", category: "Audio", price: "$149.99", description: "Noise-canceling headphones with superior sound quality.", image: "src/image/wirelessheadphones.jpg" },
  { id: 6, name: "Bluetooth Speaker", category: "Audio", price: "$89.99", description: "Portable speaker with rich sound and long battery life.", image: "src/image/speak.webp" },
  { id: 7, name: "Digital Camera", category: "Cameras", price: "$499.99", description: "High-quality camera for stunning photography.", image: "src/image/cam.png" },
  { id: 8, name: "Gaming Console", category: "Gaming", price: "$399.99", description: "Next-gen gaming console with immersive graphics and exclusive games.", image: "src/image/console.webp" },
  { id: 9, name: "E-Reader", category: "E-Readers", price: "$129.99", description: "Lightweight e-reader with a glare-free display for reading anywhere.", image: "src/image/epaper.png" },
  { id: 10, name: "Drone", category: "Drones", price: "$299.99", description: "High-performance drone with HD camera and long flight time.", image: "src/image/drone.jpeg" },
  { id: 11, name: "Monitor", category: "Computers", price: "$249.99", description: "27-inch 4K monitor with vibrant colors and sharp details.", image: "src/image/monitor1.jpg" },
  { id: 12, name: "Printer", category: "Office", price: "$129.99", description: "All-in-one printer for home and office use.", image: "src/image/printer.png" },
  { id: 13, name: "External Hard Drive", category: "Storage", price: "$79.99", description: "1TB external hard drive for extra storage.", image: "src/image/harddisk.png" },
  { id: 14, name: "Router", category: "Networking", price: "$99.99", description: "High-speed Wi-Fi router for seamless connectivity.", image: "src/image/router1.jpeg" },
  { id: 15, name: "Keyboard", category: "Accessories", price: "$59.99", description: "Mechanical keyboard for gamers and typists.", image: "src/image/keyboard.webp" },
  { id: 16, name: "Mouse", category: "Accessories", price: "$39.99", description: "Ergonomic mouse for comfortable use.", image: "src/image/mouse.jpeg" },
  { id: 17, name: "Smart Bulb", category: "Smart Home", price: "$19.99", description: "Wi-Fi enabled smart bulb for home automation.", image: "src/image/bulb.jpg" },
  { id: 18, name: "Power Bank", category: "Accessories", price: "$29.99", description: "10000mAh power bank for on-the-go charging.", image: "src/image/power.jpeg" },
  { id: 19, name: "VR Headset", category: "Gaming", price: "$299.99", description: "Immersive VR headset for gaming and entertainment.", image: "src/image/vrhead.webp" },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = products.filter((product) => product.name.toLowerCase().includes(value));
    setFilteredProducts(filtered);
    console.log("Search Term:", value);
    console.log("Filtered Products:", filtered);
  };

  return (
    <main className={styles.productDisplay}>
      <div className={styles.topBar}>
        <h1 className={styles.platformName}>Echosavvy</h1> {/* Platform Name */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchBar}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Link to="/" className={styles.homeButton}> {/* Home Button */}
          <IoHome size={24} /> Home
        </Link>
        <Link to="/cart" className={styles.cartButton}>
          <TiShoppingCart size={24} /> Cart
        </Link>
      </div>

      <div className={styles.productsDisp}>
        <div className={styles.productGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <h3>{product.name}</h3>
                <p className={styles.category}>Category: {product.category}</p>
                <p className={styles.price}>{product.price}</p>
                <p className={styles.description}>{product.description}</p>
                <button className={styles.addToCart}>Add to Cart</button>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No products found.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Products;