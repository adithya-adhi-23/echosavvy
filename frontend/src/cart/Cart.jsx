import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Cart = () => {
    const { user_id } = useParams();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8082/cart/${user_id}`);
                setCartItems(response.data);
            } catch (error) {
                console.error("❌ Error fetching cart:", error);
            }
        };

        fetchCartItems();
    }, [user_id]);

    return (
        <div>
            <h2>🛒 Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Cart is empty</p>
            ) : (
                cartItems.map(item => (
                    <div key={item.id}>
                        <img src={item.image_url} alt={item.product_name} width="100" />
                        <p>{item.product_name}</p>
                        <p>Price: ₹{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Total: ₹{item.total_amount}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;
