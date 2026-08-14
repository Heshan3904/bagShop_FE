import { useEffect, useState } from "react";

import { getOrderById, deleteOrder } from "../services/orderService";

import "./adminorderdetails.css";
import Loading from "./Loading";

export default function AdminOrderDetails({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      setLoading(true);

      try {
        const data = await getOrderById(orderId);

        if (!cancelled) {
          setOrder(data.order || null);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (!orderId) {
    return null;
  }

  if (loading) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-details-card error-card">
        <p>Unable to load order details.</p>
      </div>
    );
  }

  const orderNumber = order._id?.slice(-6).toUpperCase() || "N/A";
  const statusClass = (order.orderStatus || "Pending").toLowerCase();
  const shippingAddress = order.shippingAddress || {};
  const deliveryAddress = order.deliveryAddress || shippingAddress;
  const items = order.orderItems || [];

  const paymentMethod =
    order.paymentMethod ||
    order.paymentInfo?.method ||
    order.paymentDetails?.method ||
    "Not specified";

  const handleDeleteOrder = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this order? This action cannot be undone.");
    if (!confirmed) return;

    setDeleting(true);

    try {
      await deleteOrder(order._id);
      alert("Order deleted successfully.");
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete order.");
    } finally {
      setDeleting(false);
    }
  };

  const receiptUrl =
    order.bankReceipt ||
    order.paymentReceipt ||
    order.transferReceipt ||
    order.receiptImage ||
    order.paymentProof ||
    order.paymentInfo?.receipt ||
    order.paymentDetails?.receipt;

  const getPaymentStatusLabel = () => {
    const paymentMethod = (order.paymentMethod || "").toLowerCase();

    if (paymentMethod.includes("bank")) {
      return "Paid";
    }

    if (paymentMethod.includes("cash") || paymentMethod.includes("delivery")) {
      return "Unpaid";
    }

    return order.isPaid ? "Paid" : "Pending";
  };

  const printInvoice = () => {
    const invoiceWindow = window.open("", "_blank", "width=900,height=700");
    if (!invoiceWindow) return;

    const invoiceDate = new Date(order.createdAt).toLocaleDateString();
    const dueDate = new Date(order.createdAt);
    dueDate.setDate(dueDate.getDate() + 7);

    const itemRows = items
      .map(
        (item) => `
          <tr>
            <td>${item.name || "Item"}</td>
            <td>${item.quantity || 0}</td>
            <td>$${Number(item.price || 0).toFixed(2)}</td>
            <td>$${Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const invoiceHtml = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Invoice ${orderNumber}</title>
        <style>
          body { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 24px; color: #111827; background: #f8fafc; }
          .invoice { max-width: 800px; margin: auto; background: #ffffff; padding: 32px; border-radius: 24px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); }
          .invoice-header { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
          .invoice-title { font-size: 1.9rem; letter-spacing: 0.1em; text-transform: uppercase; color: #047857; margin: 0; }
          .company { text-align: right; }
          .company strong { display: block; font-size: 1.05rem; margin-bottom: 8px; }
          .section { margin-top: 28px; }
          .section h4 { margin-bottom: 12px; font-size: 1rem; color: #111827; }
          .details-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
          .details-card { background: #f8fafc; border-radius: 18px; padding: 18px; }
          .details-card p { margin: 8px 0; line-height: 1.5; }
          .details-card strong { display: block; margin-bottom: 4px; color: #111827; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          th, td { padding: 14px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
          th { background: #f3f4f6; color: #111827; }
          tfoot td { border-top: 2px solid #d1d5db; font-weight: 700; }
          .summary-line { display: flex; justify-content: space-between; margin: 8px 0; }
          .summary-line strong { color: #111827; }
          .footer { margin-top: 32px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
          .signature { padding-top: 20px; }
          .signature small { color: #6b7280; }
          @media print { body { background: white; } .invoice { box-shadow: none; border-radius: 0; } }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="invoice-header">
            <div>
              <p class="invoice-title">Invoice</p>
              <p>Order: ${orderNumber}</p>
            </div>
            <div class="company">
              <strong>BagShop Admin</strong>
              <p>support@bagshop.com</p>
              <p>+1 (800) 123-4567</p>
            </div>
          </div>

          <div class="details-grid section">
            <div class="details-card">
              <h4>Bill To</h4>
              <p><strong>${order.user?.name || "Customer"}</strong></p>
              <p>${order.user?.email || ""}</p>
              <p>${shippingAddress.address || ""}</p>
              <p>${shippingAddress.city || ""}, ${shippingAddress.postalCode || ""}</p>
            </div>
            <div class="details-card">
              <h4>Invoice Info</h4>
              <p><strong>Invoice No:</strong> ${orderNumber}</p>
              <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
              <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.orderStatus || "Pending"}</p>
            </div>
          </div>

          <div class="section">
            <h4>Items</h4>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">Subtotal</td>
                  <td>$${Number(order.totalPrice || 0).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div class="section details-grid">
            <div class="details-card">
              <h4>Delivery Address</h4>
              <p><strong>${deliveryAddress.fullName || shippingAddress.fullName || ""}</strong></p>
              <p>${deliveryAddress.address || shippingAddress.address || ""}</p>
              <p>${deliveryAddress.city || shippingAddress.city || ""}, ${deliveryAddress.postalCode || shippingAddress.postalCode || ""}</p>
            </div>
            <div class="details-card signature">
              <p>Authorized Signatory</p>
              <p style="margin-top: 40px; font-size: 1.5rem; color: #047857;">____________________</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
    invoiceWindow.focus();
    invoiceWindow.print();
  };

  return (
    <div className="admin-order-details-card">
      <div className="details-header">
        <div>
          <p className="details-eyebrow">Order summary</p>
          <h3>#{orderNumber}</h3>
        </div>

        <div className="details-actions">
          <button type="button" className="invoice-btn" onClick={printInvoice}>
            Download Invoice
          </button>

          <button
            type="button"
            className="delete-btn"
            onClick={handleDeleteOrder}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Order"}
          </button>

          <span className={`details-status-badge ${statusClass}`}>
            {order.orderStatus || "Pending"}
          </span>

          {onClose && (
            <button type="button" className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>
      </div>

      <div className="details-metrics">
        <div className="metric-card">
          <span>Customer</span>
          <strong>{order.user?.name || "Unknown"}</strong>
        </div>
        <div className="metric-card">
          <span>Email</span>
          <strong>{order.user?.email || "—"}</strong>
        </div>
        <div className="metric-card">
          <span>Payment</span>
          <strong>{getPaymentStatusLabel()}</strong>
        </div>
        <div className="metric-card">
          <span>Total</span>
          <strong>LKR {Number(order.totalPrice || 0).toFixed(2)}</strong>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-panel">
          <h4>Payment details</h4>
          <p>
            <span>Method</span>
            {paymentMethod}
          </p>
          <p>
            <span>Status</span>
            {getPaymentStatusLabel()}
          </p>

          {receiptUrl ? (
            <div className="payment-receipt-block">
              <p className="payment-receipt-label">Receipt</p>
              <img src={receiptUrl} alt="Payment receipt" className="payment-receipt-image" />
              <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="payment-receipt-link">
                Open receipt
              </a>
            </div>
          ) : (
            <p className="muted-text">No payment receipt uploaded for this order.</p>
          )}
        </div>

        <div className="detail-panel">
          <h4>Shipping details</h4>
          <p>
            <span>Name</span>
            {shippingAddress.fullName || "—"}
          </p>
          <p>
            <span>Phone</span>
            {shippingAddress.phone || "—"}
          </p>
          <p>
            <span>Address</span>
            {shippingAddress.address || "—"}
          </p>
          <p>
            <span>City</span>
            {shippingAddress.city || "—"}
          </p>
          <p>
            <span>Postal code</span>
            {shippingAddress.postalCode || "—"}
          </p>
        </div>

        <div className="detail-panel">
          <h4>Order items</h4>

          {items.length > 0 ? (
            items.map((item) => (
              <div className="order-item-row" key={item.product || item.name}>
                <div>
                  <strong>{item.name || "Product"}</strong>
                  <p>Qty: {item.quantity || 0}</p>
                </div>

                <div className="item-price">
                  <span>LKR {Number(item.price || 0).toFixed(2)}</span>
                  <br />
                  <small>
                    Subtotal: LKR {Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="muted-text">No products were found for this order.</p>
          )}
        </div>
      </div>
    </div>
  );
}
