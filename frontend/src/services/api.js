import axios from "axios";

// Create Axios client pointing to the backend API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the shop chosen at registration (or "Use demo shop")
const getShopId = () => localStorage.getItem("shopId");

// Dashboard overview statistics for the current shop
export const getStats = async () => {
  const response = await api.get("/dashboard/stats", { params: { shopId: getShopId() } });
  return response.data;
};

// Status of all shelves of the current shop
export const getShelves = async () => {
  const response = await api.get("/shelves", { params: { shopId: getShopId() } });
  return response.data;
};

// Alerts (active by default, or with optional status filter)
export const getAlerts = async (status) => {
  const params = { shopId: getShopId() };
  if (status) params.status = status;
  const response = await api.get("/alerts", { params });
  return response.data;
};

// Detection history log
export const getDetections = async (limit = 20) => {
  const response = await api.get("/detections", { params: { shopId: getShopId(), limit } });
  return response.data;
};

// Send a new detection event to the current shop
export const sendDetection = async (payload) => {
  const response = await api.post("/detections", { ...payload, shopId: getShopId() });
  return response.data;
};

// Reset demo data for the current shop only
export const resetDemo = () =>
  api.post("/demo/reset", { shopId: getShopId() });

export const registerShop = (payload) => api.post("/shops", payload);
export const getShop = (id) => api.get(`/shops/${id}`);
export const updateNotifications = (id, payload) =>
  api.patch(`/shops/${id}/notifications`, payload);

export default api;