import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RegisterShop from "./pages/RegisterShop";
import Dashboard from "./pages/Dashboard";

const loggedIn = () => Boolean(localStorage.getItem("token"));

function RequireAuth({ children }) {
  return loggedIn() ? children : <Navigate to="/login" replace />;
}

// Logged-in users skip the login and register pages
function GuestOnly({ children }) {
  return loggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={loggedIn() ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterShop /></GuestOnly>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}