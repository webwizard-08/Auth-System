import React, { useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient.js";

const initialForm = {
  title: "",
  amount: "",
  category: "",
  date: "",
  notes: ""
};

export default function ExpenseForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount)
      };
      await apiClient.post("/expenses", payload);
      toast.success("Expense added");
      setForm(initialForm);
      onCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Add Expense</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <input
          className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300" disabled={loading}>
        {loading ? "Saving..." : "Add Expense"}
      </button>
    </form>
  );
}
