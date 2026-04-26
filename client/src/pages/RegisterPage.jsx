import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", adminSecret: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", form);
      login(res.data);
      toast.success("Account created!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md bg-white/85 dark:bg-slate-900/80 backdrop-blur rounded-xl shadow-md p-8 border border-indigo-100/70 dark:border-slate-800">
        <h1 className="text-2xl font-semibold mb-6 text-ink dark:text-white">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
            type="text"
            name="adminSecret"
            placeholder="Admin invite code (optional)"
            value={form.adminSecret}
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white py-2 rounded-xl shadow-md hover:opacity-95 transition"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="text-sm mt-4 text-gray-500 dark:text-slate-300">
          Already have an account? <Link className="text-primary" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
