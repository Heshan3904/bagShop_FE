import api from "../api/api";

// ==========================================
// Checkout
// ==========================================
export const checkout = async (checkoutData) => {
  const response = await api.post(
    "/checkout",
    checkoutData
  );

  return response.data;
};