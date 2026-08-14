import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";

import { getOrderById } from "../services/orderService";

import "./orderdetails.css";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const data = await getOrderById(id);

      console.log("========== ORDER DETAILS ==========");
      console.log("API Response:", data);
      console.log("Order:", data.order);
      console.log("Payment Method:", data.order?.paymentMethod);
      console.log("Bank Receipt:", data.order?.bankReceipt);
      console.log("===================================");

      setOrder(data.order);
    } catch (error) {
      console.error(
        "Failed to load order:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  // ==========================================
  // Order not found
  // ==========================================

  if (!order) {
    return (
      <div className="order-details-container">
        <h2>Order not found.</h2>
      </div>
    );
  }

  // ==========================================
  // Payment information
  // ==========================================

  const paymentMethod = order.paymentMethod || "";

  const isBankTransfer =
    paymentMethod.trim().toLowerCase() ===
    "bank transfer";

  // Cloudinary URL stored in MongoDB
  const bankReceipt = order.bankReceipt || null;

  return (
    <div className="order-details-container">

      <h1>Order Details</h1>

      {/* ======================================
          ORDER SUMMARY
      ====================================== */}

      <div className="order-summary">

        <h3>Order ID</h3>

        <p>{order._id}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`status ${
              order.orderStatus
                ?.toLowerCase()
                .replace(/\s+/g, "-")
            }`}
          >
            {order.orderStatus}
          </span>
        </p>

        <p>
          <strong>Payment Method:</strong>{" "}
          {paymentMethod || "Not specified"}
        </p>

        <p>
          <strong>Payment Status:</strong>{" "}
          {order.isPaid ? "Paid" : "Pending"}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          LKR{" "}
          {Number(
            order.totalPrice || 0
          ).toLocaleString()}
        </p>

        <p>
          <strong>Order Date:</strong>{" "}
          {order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleString()
            : "N/A"}
        </p>

        {order.deliveredAt && (
          <p>
            <strong>Delivered:</strong>{" "}
            {new Date(
              order.deliveredAt
            ).toLocaleString()}
          </p>
        )}

      </div>

      {/* ======================================
          BANK TRANSFER RECEIPT
      ====================================== */}

      {isBankTransfer && (
        <div className="payment-receipt-box">

          <h2>Bank Transfer Receipt</h2>

          {bankReceipt ? (
            <>
              <p className="receipt-description">
                Your uploaded bank transfer receipt:
              </p>

              <div className="receipt-image-container">

                <img
                  src={bankReceipt}
                  alt="Bank Transfer Receipt"
                  className="bank-receipt-image"
                  onError={(event) => {
                    console.error(
                      "Failed to load receipt image:",
                      bankReceipt
                    );

                    event.currentTarget.style.display =
                      "none";
                  }}
                />

              </div>

              <a
                href={bankReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="view-receipt-button"
              >
                View Full Receipt
              </a>

            </>
          ) : (
            <div className="receipt-not-found">

              <p>
                No bank transfer receipt was found
                for this order.
              </p>

              <small>
                Receipt URL is missing from the
                order data.
              </small>

            </div>
          )}

        </div>
      )}

      {/* ======================================
          SHIPPING ADDRESS
      ====================================== */}

      <div className="shipping-box">

        <h2>Shipping Address</h2>

        <p>
          <strong>Name:</strong>{" "}
          {order.shippingAddress?.fullName}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {order.shippingAddress?.phone}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {order.shippingAddress?.address}
        </p>

        <p>
          <strong>City:</strong>{" "}
          {order.shippingAddress?.city}
        </p>

        <p>
          <strong>Postal Code:</strong>{" "}
          {order.shippingAddress?.postalCode}
        </p>

      </div>

      {/* ======================================
          ORDERED PRODUCTS
      ====================================== */}

      <div className="items-box">

        <h2>Ordered Products</h2>

        {order.orderItems?.map((item) => (

          <div
            className="order-item"
            key={item.product}
          >

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="item-info">

              <h3>{item.name}</h3>

              <p>
                Price: LKR{" "}
                {Number(
                  item.price || 0
                ).toLocaleString()}
              </p>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Subtotal: LKR{" "}
                {Number(
                  (item.price || 0) *
                  (item.quantity || 0)
                ).toLocaleString()}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}