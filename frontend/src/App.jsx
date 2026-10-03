import { Routes, Route, Navigate } from "react-router-dom";
import RegisterShop from "./pages/RegisterShop";
import Dashboard from "./pages/Dashboard";

const hasShop = () => Boolean(localStorage.getItem("shopId"));

// Block the dashboard until a shop is chosen
function RequireShop({ children }) {
  return hasShop() ? children : <Navigate to="/register" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={hasShop() ? "/dashboard" : "/register"} replace />} />
      <Route path="/register" element={<RegisterShop />} />
      <Route
        path="/dashboard"
        element={
          <RequireShop>
            <Dashboard />
          </RequireShop>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}