import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected, clear the session and go to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthCall = err.config?.url?.startsWith("/auth/login");
    if (err.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("token");
      localStorage.removeItem("shopId");
      localStorage.removeItem("shopName");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// The backend reads the shop from the token, so no shopId is sent anymore
export const getStats = async () => (await api.get("/dashboard/stats")).data;
export const getShelves = async () => (await api.get("/shelves")).data;

export const getAlerts = async (status) => {
  const params = status ? { status } : {};
  return (await api.get("/alerts", { params })).data;
};

export const getDetections = async (limit = 20) =>
  (await api.get("/detections", { params: { limit } })).data;

export const sendDetection = async (payload) =>
  (await api.post("/detections", payload)).data;

export const resetDemo = () => api.post("/demo/reset");

// Auth and shop. These return the full Axios response (use res.data).
export const login = (payload) => api.post("/auth/login", payload);
export const registerShop = (payload) => api.post("/shops", payload);
export const getShop = (id) => api.get(`/shops/${id}`);
export const updateNotifications = (id, payload) =>
  api.patch(`/shops/${id}/notifications`, payload);

// Small helper used by Login and Register
export const saveSession = ({ token, shop }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("shopId", shop._id);
  localStorage.setItem("shopName", shop.shopName);
};

export default api;