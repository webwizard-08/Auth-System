import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Toast from "../components/Toast.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setToast(null);
    setLoading(true);

    try {
      await api.post("/api/auth/register", form);
      navigate("/login", {
        replace: true,
        state: {
          toast: {
            type: "success",
            message: "Signup successful. Please log in."
          }
        }
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7ff] via-[#f6f1e7] to-[#fff5e6] px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.2fr]">
        <div className="rounded-[32px] border border-white/60 bg-white/90 p-10 shadow-glass backdrop-blur">
          <h2 className="font-display text-2xl">Create account</h2>
          <p className="mt-2 text-sm text-[#5b5b55]">Start a new session in seconds.</p>
          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <input
              className="w-full rounded-2xl border border-[#e8dcc9] bg-white px-4 py-3 text-sm outline-none transition focus:border-cobalt/60 focus:ring-2 focus:ring-cobalt/20"
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              required
            />
            <input
              className="w-full rounded-2xl border border-[#e8dcc9] bg-white px-4 py-3 text-sm outline-none transition focus:border-cobalt/60 focus:ring-2 focus:ring-cobalt/20"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
            <input
              className="w-full rounded-2xl border border-[#e8dcc9] bg-white px-4 py-3 text-sm outline-none transition focus:border-cobalt/60 focus:ring-2 focus:ring-cobalt/20"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
            />
            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-terracotta to-[#f5a74b] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating..." : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-sm text-[#5b5b55]">
            Already have an account?{" "}
            <Link className="font-semibold text-cobalt" to="/login">
              Login
            </Link>
          </p>
        </div>

        <Toast
          type={toast?.type}
          message={toast?.message}
          onClose={() => setToast(null)}
        />

        <div className="rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-glass backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
            Session Builder
          </p>
          <h1 className="mt-4 font-display text-4xl">Make a new identity.</h1>
          <p className="mt-4 text-base text-[#5b5b55]">
            Create a profile and jump right into your JWT-protected dashboard.
          </p>
          <div className="mt-10 grid gap-4 rounded-2xl border border-[#efe7d8] bg-[#fffaf2] p-6 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Register Endpoint</span>
              <span className="text-[#5b5b55]">/api/auth/register</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Redirect</span>
              <span className="text-[#5b5b55]">/login</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
