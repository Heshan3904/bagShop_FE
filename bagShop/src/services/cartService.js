import api from "../api/api";

// ==========================================
// Add Product To Cart
// ==========================================
export const addToCart = async (productId, quantity = 1, image = "") => {
  const response = await api.post("/cart", {
    productId,
    quantity,
    image,
  });

  return response.data;
};

// ==========================================
// Get User Cart
// ==========================================
export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

// ==========================================
// Update Quantity
// ==========================================
export const updateCartQuantity = async (productId, quantity) => {
  const response = await api.put("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

// ==========================================
// Remove Product
// ==========================================
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);

  return response.data;
};