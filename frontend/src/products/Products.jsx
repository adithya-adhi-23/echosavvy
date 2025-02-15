import React, { useState } from 'react';
import styles from './Products.module.css'

const products = [
  { id: 1, name: 'Dell XPS 13', category: 'Laptops', price: '$1200' },
  { id: 2, name: 'MacBook Air', category: 'Laptops', price: '$999' },
  { id: 3, name: 'iPhone 15', category: 'Mobiles', price: '$799' },
  { id: 4, name: 'Samsung Galaxy S23', category: 'Mobiles', price: '$699' },
  { id: 5, name: 'Asus ROG Zephyrus', category: 'Laptops', price: '$1500' },
];

const ProductPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.pageHeading}>Product Page</h1>
      
      <input
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchBar}
      />
      
      <div className={styles.productList}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <p className={styles.productName}>{product.name}</p>
            <p className={styles.productCategory}>{product.category}</p>
            <p className={styles.productPrice} hidden>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
