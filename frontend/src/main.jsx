import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';
import Products from './products/Products';
import Signup from './signup/Signup';
import Cart from './cart/Cart';
import { CartProvider } from './cart/CartContext'; // Correct import path

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/products',
    element: <Products />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
]);

// Wrap the RouterProvider with CartProvider
const Root = () => (
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
);

// Render the Root component
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);