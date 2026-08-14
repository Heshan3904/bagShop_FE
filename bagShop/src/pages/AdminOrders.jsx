import { useEffect, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

import AdminOrderDetails from "./AdminOrderDetails";
import "./adminorders.css";
import Navibar from "../components/Navibar";
import Loading from "./Loading";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data.orders);
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

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const getPaymentStatusLabel = (order) => {
    const paymentMethod = (order.paymentMethod || "").toLowerCase();

    if (paymentMethod.includes("bank")) {
      return "Paid";
    }

    if (paymentMethod.includes("cash") || paymentMethod.includes("delivery")) {
      return "Unpaid";
    }

    return order.isPaid ? "Paid" : "Pending";
  };

  if (loading) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  return (
    <>
    <Navibar/>
    <div className="admin-orders">

      <h1>Manage Orders</h1>

      <table>

        <thead>

          <tr>

            <th>Order ID</th>

            <th>Customer</th>

            <th>Email</th>

            <th>Total</th>

            <th>Payment</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr key={order._id}>

              <td>{order._id.slice(-6).toUpperCase()}</td>

              <td>{order.user?.name}</td>

              <td>{order.user?.email}</td>

              <td>LKR {Number(order.totalPrice || 0).toFixed(2)}</td>

              <td>

                {getPaymentStatusLabel(order)}

              </td>

              <td>

                <span className={order.orderStatus.toLowerCase()}>

                  {order.orderStatus}

                </span>

              </td>

              <td>

                <div className="admin-order-actions">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Shipped">
                      Shipped
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                  <button
                    type="button"
                    className="details-toggle-btn"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    {selectedOrderId === order._id ? "Hide details" : "View details"}
                  </button>
                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {selectedOrderId && (
        <div className="details-modal-overlay" onClick={() => setSelectedOrderId(null)}>
          <div className="details-panel-wrapper" onClick={(e) => e.stopPropagation()}>
            <AdminOrderDetails
              orderId={selectedOrderId}
              onClose={() => {
                setSelectedOrderId(null);
                loadOrders();
              }}
            />
          </div>
        </div>
      )}

    </div>
    </>
  );

}