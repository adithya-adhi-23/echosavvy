import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from './home/Home';
import Login from './login/Login';
import Products from './products/Products';
import Signup from './signup/signup';
import Cart from './cart/Cart';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/products",
    element: <Products />,
  },
  {
    path:"/signup",
    element: <Signup />,
  },
  {
    path:"/cart",
    element:<Cart />,
  }

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);