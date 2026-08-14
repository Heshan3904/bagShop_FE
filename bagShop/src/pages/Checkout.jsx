import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import { checkout } from "../services/checkoutService";
import { FaImage } from "react-icons/fa";

import "./checkout.css";
import Footer from "../components/Footer";
import Navibar from "../components/Navibar";
import Loading from "./Loading";

const DELIVERY_CHARGE = 300;

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
  });

  // ==========================================
  // Load cart
  // ==========================================

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================================
  // Clean preview URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }
    };
  }, [receiptPreview]);

  // ==========================================
  // Get cart
  // ==========================================

  const loadCart = async () => {
    try {
      const data = await getCart();

      console.log("Cart response:", data);

      setCart(data.cart);
    } catch (error) {
      console.error("Failed to load cart:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Handle input changes
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    // Remove receipt when changing away from Bank Transfer
    if (
      name === "paymentMethod" &&
      value !== "Bank Transfer"
    ) {
      setReceipt(null);

      if (receiptPreview) {
        URL.revokeObjectURL(receiptPreview);
      }

      setReceiptPreview("");
    }
  };

  // ==========================================
  // Handle receipt selection
  // ==========================================

  const handleReceiptChange = (event) => {
    const selectedReceipt = event.target.files?.[0];

    if (!selectedReceipt) {
      return;
    }

    // Check image type
    if (!selectedReceipt.type.startsWith("image/")) {
      alert("Please select an image file.");

      event.target.value = "";

      return;
    }

    // Check file size
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (selectedReceipt.size > maxSize) {
      alert("Receipt image must be smaller than 5 MB.");

      event.target.value = "";

      return;
    }

    // Remove previous preview
    if (receiptPreview) {
      URL.revokeObjectURL(receiptPreview);
    }

    // Save selected file
    setReceipt(selectedReceipt);

    // Create preview
    const previewUrl =
      URL.createObjectURL(selectedReceipt);

    setReceiptPreview(previewUrl);
  };

  // ==========================================
  // Checkout
  // ==========================================

  const handleCheckout = async (event) => {
    event.preventDefault();

    // ==========================================
    // Validate bank receipt
    // ==========================================

    if (
      form.paymentMethod === "Bank Transfer" &&
      !receipt
    ) {
      alert(
        "Please upload your bank transfer receipt before placing the order."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      // ==========================================
      // Create FormData
      // ==========================================

      const checkoutData = new FormData();

      // Shipping address
      checkoutData.append(
        "shippingAddress",
        JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        })
      );

      // Payment method
      checkoutData.append(
        "paymentMethod",
        form.paymentMethod
      );

      // Delivery charge
      checkoutData.append(
        "deliveryCharge",
        DELIVERY_CHARGE.toString()
      );

      // ==========================================
      // Bank receipt
      // IMPORTANT:
      // Backend/Multer will upload this to Cloudinary
      // ==========================================

      if (
        form.paymentMethod === "Bank Transfer" &&
        receipt
      ) {
        checkoutData.append(
          "bankReceipt",
          receipt
        );
      }

      // Debug FormData
      console.log("========== CHECKOUT DATA ==========");

      for (const [key, value] of checkoutData.entries()) {
        console.log(
          key,
          value instanceof File
            ? value.name
            : value
        );
      }

      // ==========================================
      // Send checkout request
      // ==========================================

      const response = await checkout(
        checkoutData
      );

      console.log(
        "Checkout response:",
        response
      );

      alert("Order placed successfully!");

      // ==========================================
      // Go to orders
      // ==========================================

      navigate("/my-orders");

    } catch (error) {
      console.error(
        "Checkout error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Checkout failed"
      );
    } finally {
      setIsSubmitting(false);
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
  // Empty cart
  // ==========================================

  if (
    !cart ||
    !cart.items ||
    cart.items.length === 0
  ) {
    return (
      <>
        <Navibar />

        <div className="checkout-container">
          <h2>Your cart is empty.</h2>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>

        <Footer />
      </>
    );
  }

  // ==========================================
  // Calculate totals
  // ==========================================

  const subtotal = Number(
    cart.totalPrice || 0
  );

  const total =
    subtotal + DELIVERY_CHARGE;

  const formatPrice = (price) =>
    `LKR ${Number(
      price || 0
    ).toLocaleString()}`;

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      <Navibar />

      <div className="checkout-container">

        {/* ======================================
            LEFT SIDE
        ====================================== */}

        <div className="checkout-left">

          <h2>Shipping details</h2>

          <form onSubmit={handleCheckout}>

            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />

            {/* City */}
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />

            {/* Postal Code */}
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              required
            />

            {/* ==================================
                PAYMENT METHODS
            ================================== */}

            <fieldset className="payment-methods">

              <legend>
                Payment method
              </legend>

              {/* Cash on Delivery */}

              <label
                className={
                  form.paymentMethod ===
                  "Cash on Delivery"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    form.paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={handleChange}
                />

                <span>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives.
                  </small>
                </span>

              </label>

              {/* Bank Transfer */}

              <label
                className={
                  form.paymentMethod ===
                  "Bank Transfer"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={
                    form.paymentMethod ===
                    "Bank Transfer"
                  }
                  onChange={handleChange}
                />

                <span>
                  <strong>
                    Bank Transfer
                  </strong>

                  <small>
                    Upload your transfer
                    receipt to place the order.
                  </small>
                </span>

              </label>

            </fieldset>

            {/* ==================================
                BANK RECEIPT
            ================================== */}

            {form.paymentMethod ===
              "Bank Transfer" && (

              <div className="receipt-upload">

                <span className="receipt-upload-label">
                  Bank transfer receipt{" "}
                  <em>*</em>
                </span>

                <label className="receipt-upload-box">

                  {receiptPreview ? (

                    <><br /></>

                  ) : (

                    <>
                      <FaImage
                        className="receipt-upload-icon"
                      />

                      <p>
                        Upload transfer receipt
                      </p>

                      <span>
                        Click to browse
                      </span>
                    </>

                  )}

                  <input
                    type="file"
                    name="bankReceipt"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleReceiptChange
                    }
                    required
                    hidden
                  />

                </label>

                <small className="receipt-upload-hint">

                  {receipt
                    ? `Selected: ${receipt.name}`
                    : "Upload JPG, PNG, or WebP image. Maximum 5 MB."}

                </small>

              </div>

            )}

            {/* ==================================
                PLACE ORDER
            ================================== */}

            <button
              type="submit"
              disabled={isSubmitting}
            >

              {isSubmitting
                ? "Placing order..."
                : "Place order"}

            </button>

          </form>

        </div>

        {/* ======================================
            RIGHT SIDE
        ====================================== */}

        <aside className="checkout-right">

          <h2>Order summary</h2>

          {/* Cart items */}

          {cart.items.map((item) => (

            <div
              className="summary-item"
              key={item.product}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>

                <h4>
                  {item.name}
                </h4>

                <p>
                  {item.quantity} ×{" "}
                  {formatPrice(item.price)}
                </p>

              </div>

              <strong>
                {formatPrice(
                  item.price *
                    item.quantity
                )}
              </strong>

            </div>

          ))}

          {/* Totals */}

          <div className="summary-totals">

            <p>
              <span>
                Subtotal
              </span>

              <strong>
                {formatPrice(subtotal)}
              </strong>
            </p>

            <p>
              <span>
                Delivery charge
              </span>

              <strong>
                {formatPrice(
                  DELIVERY_CHARGE
                )}
              </strong>
            </p>

            <p className="order-total">

              <span>
                Total price
              </span>

              <strong>
                {formatPrice(total)}
              </strong>

            </p>

          </div>

        </aside>

      </div>

      <Footer />
    </>
  );
}