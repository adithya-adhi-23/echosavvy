import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items from the backend or localStorage
  const fetchCartItems = async (user_id) => {
    const token = localStorage.getItem('token');
    if (token && user_id) {
      try {
        const response = await axios.get(`http://localhost:8082/cart/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    } else {
      // For guest users, load cart items from localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    }
  };

  // Add an item to the cart
  const addToCart = async (item) => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token && user_id) {
      try {
        const response = await axios.post('http://localhost:8082/cart/add', item, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([...cartItems, response.data]);
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      }
    } else {
      // For guest users, add to localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const existingItem = guestCart.find((i) => i.product_id === item.product_id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        guestCart.push(item);
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  // Remove an item from the cart
  const removeItem = async (product_id) => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token && user_id) {
      try {
        await axios.delete('http://localhost:8082/cart/remove', {
          data: { user_id, product_id },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(cartItems.filter((item) => item.product_id !== product_id));
      } catch (error) {
        console.error("Error removing item:", error);
      }
    } else {
      // For guest users, remove from localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item.product_id !== product_id);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    }
  };

  // Increase the quantity of an item
  const increaseAmount = async (product_id) => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token && user_id) {
      try {
        await axios.put('http://localhost:8082/cart/update', {
          user_id,
          product_id,
          quantity: 1,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCartItems(user_id);
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    } else {
      // For guest users, update localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const item = guestCart.find((item) => item.product_id === product_id);
      if (item) {
        item.quantity += 1;
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems(guestCart);
      }
    }
  };

  // Decrease the quantity of an item
  const decreaseAmount = async (product_id) => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token && user_id) {
      try {
        await axios.put('http://localhost:8082/cart/update', {
          user_id,
          product_id,
          quantity: -1,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCartItems(user_id);
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    } else {
      // For guest users, update localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const item = guestCart.find((item) => item.product_id === product_id);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          guestCart.splice(guestCart.indexOf(item), 1); // Remove item if quantity is 0
        }
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        setCartItems(guestCart);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, fetchCartItems, addToCart, removeItem, increaseAmount, decreaseAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);