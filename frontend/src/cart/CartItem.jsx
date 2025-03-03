import React from "react";
import styles from "./Cart.module.css";

const CartItems = ({ item, onMouseEnter, onMouseLeave, updateQuantity, removeItem }) => {
  const { product_id, product_name, price, quantity, image_url } = item;

  return (
    <div
      className={styles.cartItem}
      aria-label={`Cart item: ${product_name}, Quantity: ${quantity}, Price: ${price}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.cartImageName}>
        <img
          src={image_url || "fallback-image-url"}
          alt={product_name}
          className={styles.cartImage}
          onError={(e) => {
            e.target.src = "fallback-image-url";
          }}
        />
        <p className={styles.cartProductName}>{product_name}</p>
      </div>

      <div className={styles.cartAmountToggle}>
        <button
          onClick={() => updateQuantity(product_id, -1)}
          onMouseEnter={() => onMouseEnter("Decrease quantity by one.")}
          onMouseLeave={onMouseLeave}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => updateQuantity(product_id, 1)}
          onMouseEnter={() => onMouseEnter("Increase quantity by one.")}
          onMouseLeave={onMouseLeave}
        >
          +
        </button>
      </div>

      <p className={styles.cartPrice}>${price}</p>

      <button
        className={styles.removeButton}
        onClick={() => removeItem(product_id)}
        onMouseEnter={() => onMouseEnter(`Remove ${product_name} from cart.`)}
        onMouseLeave={onMouseLeave}
      >
        🗑 Remove
      </button>
    </div>
  );
};

export default CartItems;