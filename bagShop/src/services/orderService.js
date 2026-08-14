import api from "../api/api";

// ==========================================
// Get Logged-in User Orders
// ==========================================
export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");

  return response.data;
};

// ==========================================
// Get Single Order
// ==========================================
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

// ==========================================
// Admin - Get All Orders
// ==========================================
export const getAllOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};

// ==========================================
// Admin - Update Order Status
// ==========================================
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};

// ==========================================
// Admin - Delete Order
// ==========================================
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);

  return response.data;
};