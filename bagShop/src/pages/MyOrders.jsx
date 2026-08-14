import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../services/orderService";

import "./myorders.css";
import Navibar from '../components/Navibar';
import Footer from '../components/Footer';
import Loading from "./Loading";

const getOrderStatus = (order) => order.orderStatus || order.status || "Pending";
const getStatusClass = (status) => status.toLowerCase().trim().replace(/\s+/g, "-");

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  if (orders.length === 0) {
    return (
<><Navibar/>
      <div className="orders-container">
        <h2>No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
     <Footer/>
      </>
    );
  }

  return (
    <>
    <Navibar/>
    <div className="orders-container">

      <h1>My Orders</h1>

      {orders.map((order) => {
        const orderStatus = getOrderStatus(order);

        return (

        <div
          className="order-card"
          key={order._id}
        >

          <div className="order-header">

            <h3>
              Order #{order._id.slice(-6).toUpperCase()}
            </h3>

            <span className={`status ${getStatusClass(orderStatus)}`}>
              <span className="status-dot" aria-hidden="true" />
              {orderStatus}
            </span>

          </div>

          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>

          <p>
            <strong>Total:</strong> LKR {Number(order.totalPrice || 0).toLocaleString()}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {order.isPaid ? "Paid" : order.paymentMethod === "Bank Transfer" ? "Bank transfer pending verification" : "Cash on Delivery"}
          </p>

          <p>
            <strong>Items:</strong> {order.orderItems?.length || 0}
          </p>

          <Link
            to={`/orders/${order._id}`}
            className="details-btn"
          >
            View Details
          </Link>

        </div>

        );
      })}

    </div>
    <Footer/>
      </>
  );
}
