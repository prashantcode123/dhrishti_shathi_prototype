import axios from "axios";

// Create Axios client pointing to the backend API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch dashboard overview statistics
export const getStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

// Fetch status of all 12 shelves
export const getShelves = async () => {
  const response = await api.get("/shelves");
  return response.data;
};

// Fetch alerts (active by default, or with optional status filter)
export const getAlerts = async (status) => {
  const params = status ? { status } : {};
  const response = await api.get("/alerts", { params });
  return response.data;
};

// Fetch detection history log
export const getDetections = async (limit = 20) => {
  const response = await api.get("/detections", { params: { limit } });
  return response.data;
};

// Send a new detection event
export const sendDetection = async (payload) => {
  const response = await api.post("/detections", payload);
  return response.data;
};

// Reset all demo data — wipes detections, alerts, and restores all shelves to NORMAL
export const resetDemo = async () => {
  const response = await api.post("/demo/reset");
  return response.data;
};


export const registerShop = (payload) => api.post("/shops", payload);
export const getShop = (id) => api.get(`/shops/${id}`);
export const updateNotifications = (id, payload) =>
  api.patch(`/shops/${id}/notifications`, payload);

export default api;
