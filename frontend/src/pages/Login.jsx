import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, saveSession } from "../services/api";

const input =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@example.com");
    setPassword("demo1234");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-md"
      >
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shop login</h1>
          <p className="text-sm text-gray-500">Sign in to see your shelf alerts.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500">
          New shop?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Register
          </Link>
          {" · "}
        </p>
      </form>
    </div>
  );
}