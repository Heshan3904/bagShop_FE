import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../services/cartService";

import "./Cart.css";
import Footer from "../components/Footer";
import Navibar from "../components/Navibar";
import Loading from "./Loading";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await getCart();

      console.log("Cart Response:", response);

      if (response.success) {
        setCart(response.cart);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error(error);

      setCart(null);

      alert(
        error.response?.data?.message ||
          "Failed to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      await updateCartQuantity(
        item.product,
        item.quantity + 1
      );

      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await updateCartQuantity(
        item.product,
        item.quantity - 1
      );

      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const deleteItem = async (productId) => {
    if (!window.confirm("Remove this product?")) return;

    try {
      await removeFromCart(productId);

      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  if (loading) {
    return( 
    <>
    <Loading/>
    </>
  );

  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
      <Navibar/>
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
      <Footer/>
      </>
    );
  }

  return (
    <>
    <Navibar/>
    <div className="cart-container">

      <h1>Shopping Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item.product}
          className="cart-item"
        >
          <img
            src={item.image}
            alt={item.name}
          />

          <div className="cart-info">

            <h3>{item.name}</h3>

            <p>LKR {item.price}</p>

            <div className="quantity">

              <button
                onClick={() =>
                  decreaseQuantity(item)
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  increaseQuantity(item)
                }
              >
                +
              </button>

            </div>

            <h4>
              Subtotal : $
              {(
                item.price * item.quantity
              ).toFixed(2)}
            </h4>

          </div>

          <button
            className="remove-btn"
            onClick={() =>
              deleteItem(item.product)
            }
          >
            Remove
          </button>

        </div>
      ))}

      <hr />

      <div className="cart-summary">

        <h2>
          Total : ${cart.totalPrice.toFixed(2)}
        </h2>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed To Checkout
        </button>

      </div>

    </div>
    <Footer/>
    </>
  );
}