import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerShop, saveSession } from "../services/api";

const ALERT_TYPES = [
  { value: "EMPTY", label: "🔴 Empty shelf" },
  { value: "LOW_STOCK", label: "🟡 Low stock" },
  { value: "MISPLACED", label: "🟠 Misplaced product" },
];

const input =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export default function RegisterShop() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    numberOfShelves: 8,
  });
  const [alertsOn, setAlertsOn] = useState(true);
  const [alertTypes, setAlertTypes] = useState(["EMPTY", "LOW_STOCK", "MISPLACED"]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleType = (type) =>
    setAlertTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  // Client-side checks, same rules as the backend
  const validate = () => {
    const e = {};
    if (!form.shopName.trim()) e.shopName = "Shop name is required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Phone must be exactly 10 digits";
    const n = Number(form.numberOfShelves);
    if (!Number.isInteger(n) || n < 1 || n > 50) e.numberOfShelves = "Enter a number from 1 to 50";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const { data } = await registerShop({
        ...form,
        numberOfShelves: Number(form.numberOfShelves),
        notifications: { emailEnabled: alertsOn, alertTypes },
      });
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      const d = err.response?.data;
      setServerError(
        d?.errors ? d.errors.join(", ") : d?.message || "Could not reach the server. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reusable input. autoComplete="off" is the default; props can override it.
  const field = (name, label, props = {}) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        name={name}
        value={form[name]}
        onChange={change}
        className={input}
        autoComplete="off"
        {...props}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-md"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900">Register your shop</h1>
          <p className="text-sm text-gray-500">
            Get shelf alerts for empty, low-stock and misplaced products.
          </p>
        </div>

        {field("shopName", "Shop name")}
        {field("ownerName", "Owner name")}
        {field("email", "Email", { type: "email", autoComplete: "new-password" })}
        {field("password", "Password (min 6 characters)", { type: "password", autoComplete: "new-password" })}
        {field("phone", "Phone (10 digits)", {
          inputMode: "numeric",
          maxLength: 10,
          autoComplete: "new-password",
        })}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("address", "Address", { autoComplete: "new-password" })}
          {field("city", "City")}
        </div>
        {field("numberOfShelves", "Number of shelves (1-50)", { type: "number", min: 1, max: 50 })}

        <div className="rounded-lg bg-gray-50 p-4">
          <label className="flex items-center justify-between text-sm font-medium text-gray-800">
            Popup alerts
            <input
              type="checkbox"
              checked={alertsOn}
              onChange={(e) => setAlertsOn(e.target.checked)}
            />
          </label>
          <div className="mt-3 space-y-2">
            {ALERT_TYPES.map((t) => (
              <label key={t.value} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={alertTypes.includes(t.value)}
                  onChange={() => toggleType(t.value)}
                  disabled={!alertsOn}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {serverError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register shop"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            LogIn
          </Link>
        </p>
      </form>
    </div>
  );
}