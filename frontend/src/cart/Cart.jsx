import React, { useEffect } from 'react';
import { useCart } from './CartContext';
import CartItems from './CartItems';
import styles from './Cart.module.css';

const Cart = () => {
  const { cartItems, fetchCartItems } = useCart();
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    fetchCartItems(user_id);
  }, [user_id]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className={styles.cartPage}>
      <h2>🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className={styles.noResults}>Your cart is empty.</p>
      ) : (
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <CartItems
              key={item.product_id}
              item={item}
              onRemove={() => removeItem(item.product_id)}
              onIncrease={() => increaseAmount(item.product_id)}
              onDecrease={() => decreaseAmount(item.product_id)}
            />
          ))}
          <div className={styles.cartTotal}>
            <h3>Total: ₹{calculateTotal()}</h3>
            <button className={styles.checkoutButton}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;