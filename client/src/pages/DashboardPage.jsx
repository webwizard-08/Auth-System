import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient.js";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseFilters from "../components/ExpenseFilters.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import Pagination from "../components/Pagination.jsx";
import SummaryCard from "../components/SummaryCard.jsx";
import CategoryChart from "../components/CategoryChart.jsx";
import { Tag, TrendingUp, Wallet } from "lucide-react";

const initialFilters = {
  search: "",
  category: "",
  startDate: "",
  endDate: ""
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [editing, setEditing] = useState(null);

  const fetchExpenses = async (page = pagination.page) => {
    const params = { page, limit: 8, ...filters };
    const res = await apiClient.get("/expenses", { params });
    setExpenses(res.data.items);
    setPagination(res.data.pagination);
  };

  const fetchSummary = async () => {
    const [weeklyRes, monthlyRes] = await Promise.all([
      apiClient.get("/expenses/summary", { params: { range: "weekly" } }),
      apiClient.get("/expenses/summary", { params: { range: "monthly" } })
    ]);
    setWeeklySummary(weeklyRes.data);
    setMonthlySummary(monthlyRes.data);
  };

  useEffect(() => {
    fetchExpenses(1).catch(() => toast.error("Failed to load expenses"));
    fetchSummary().catch(() => toast.error("Failed to load summary"));
  }, [filters]);

  const handleDelete = async (item) => {
    if (!confirm("Delete this expense?")) return;
    await apiClient.delete(`/expenses/${item._id}`);
    toast.success("Expense deleted");
    fetchExpenses();
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    await apiClient.patch(`/expenses/${editing._id}`, {
      title: editing.title,
      amount: Number(editing.amount),
      category: editing.category,
      date: editing.date,
      notes: editing.notes
    });
    toast.success("Expense updated");
    setEditing(null);
    fetchExpenses();
  };

  const totalAmount = expenses.reduce((acc, item) => acc + Number(item.amount || 0), 0);
  const monthTotal = monthlySummary?.total || 0;
  const topCategory = monthlySummary?.breakdown?.[0]?._id || "-";

  const formatRupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Summary</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <SummaryCard title="Total Expenses" value={formatRupee(totalAmount)} icon={Wallet} />
          <SummaryCard title="This Month Expense" value={formatRupee(monthTotal)} icon={TrendingUp} />
          <SummaryCard title="Top Category" value={topCategory} icon={Tag} />
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <ExpenseForm onCreated={() => fetchExpenses(1)} />
        <CategoryChart data={monthlySummary?.breakdown || []} />
      </div>

      <ExpenseFilters
        filters={filters}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        onReset={() => setFilters(initialFilters)}
      />

      {editing && (
        <form
          onSubmit={handleEditSave}
          className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 grid md:grid-cols-5 gap-3"
        >
          <input
            className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
            type="number"
            value={editing.amount}
            onChange={(e) => setEditing({ ...editing, amount: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
            value={editing.category}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
            type="date"
            value={editing.date?.slice(0, 10)}
            onChange={(e) => setEditing({ ...editing, date: e.target.value })}
          />
          <input
            className="border border-gray-300 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:ring-2 focus:ring-indigo-500 transition"
            value={editing.notes || ""}
            onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
          />
          <div className="flex gap-2 md:col-span-5">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300" type="submit">Save</button>
            <button
              type="button"
              className="border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-lg"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <span className="text-sm text-gray-500">Latest 5</span>
        </div>
        <ExpenseList
          items={expenses.slice(0, 5)}
          onEdit={(item) => setEditing({ ...item })}
          onDelete={handleDelete}
          showActions={false}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Expenses</h2>
          <span className="text-sm text-gray-500">{pagination.total || expenses.length} items</span>
        </div>
        <ExpenseList
          items={expenses}
          onEdit={(item) => setEditing({ ...item })}
          onDelete={handleDelete}
          showActions={true}
        />
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          onPageChange={(next) => fetchExpenses(next)}
        />
      </section>
    </div>
  );
}
