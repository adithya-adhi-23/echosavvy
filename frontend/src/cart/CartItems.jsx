import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useCart } from './CartContext'; // Import useCart if needed

const CartItems = ({ item }) => {
  const { product_id, product_name, price, quantity, image_url } = item;
  const { removeItem, increaseAmount, decreaseAmount } = useCart(); // Use cart context functions if needed

  return (
    <div className="cart-item">
      <div className="cart-image--name">
        <img src={image_url} alt={product_name} />
        <p>{product_name}</p>
      </div>
      <p>₹{price}</p>
      <div className="cart-amount-toggle">
        <button onClick={() => decreaseAmount(product_id)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => increaseAmount(product_id)}>+</button>
      </div>
      <p>₹{(price * quantity).toFixed(2)}</p>
      <FaTrash className="remove-icon" onClick={() => removeItem(product_id)} />
    </div>
  );
};

export default CartItems;