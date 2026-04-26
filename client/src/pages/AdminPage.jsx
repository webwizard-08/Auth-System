import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import apiClient from "../api/apiClient.js";
import Pagination from "../components/Pagination.jsx";

export default function AdminPage() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, pages: 1 });
  const [expenses, setExpenses] = useState([]);
  const [expensePagination, setExpensePagination] = useState({ page: 1, pages: 1 });

  const fetchAnalytics = async () => {
    const res = await apiClient.get("/admin/analytics");
    setAnalytics(res.data);
  };

  const fetchUsers = async (page = 1) => {
    const res = await apiClient.get("/admin/users", { params: { page, limit: 8 } });
    setUsers(res.data.items);
    setUserPagination(res.data.pagination);
  };

  const fetchExpenses = async (page = 1) => {
    const res = await apiClient.get("/admin/expenses", { params: { page, limit: 8 } });
    setExpenses(res.data.items);
    setExpensePagination(res.data.pagination);
  };

  useEffect(() => {
    fetchAnalytics().catch(() => toast.error("Failed to load analytics"));
    fetchUsers().catch(() => toast.error("Failed to load users"));
    fetchExpenses().catch(() => toast.error("Failed to load expenses"));
  }, []);

  const toggleBlock = async (user) => {
    await apiClient.patch(`/admin/users/${user._id}/block`, { blocked: !user.isBlocked });
    toast.success(user.isBlocked ? "User unblocked" : "User blocked");
    fetchUsers(userPagination.page);
  };

  const removeUser = async (user) => {
    if (!confirm("Delete this user and their expenses?")) return;
    await apiClient.delete(`/admin/users/${user._id}`);
    toast.success("User deleted");
    fetchUsers(userPagination.page);
  };

  const formatRupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800">
          <p className="text-sm text-gray-500">Total users</p>
          <p className="text-2xl font-semibold">{analytics?.totalUsers || 0}</p>
        </div>
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800">
          <p className="text-sm text-gray-500">Total expenses</p>
          <p className="text-2xl font-semibold">{analytics?.totalExpenses || 0}</p>
        </div>
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800">
          <p className="text-sm text-gray-500">Top category</p>
          <p className="text-2xl font-semibold">
            {analytics?.categoryStats?.[0]?._id || "-"}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Users</h2>
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-200 dark:border-slate-800">
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{user.isBlocked ? "Blocked" : "Active"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      className="px-2 py-1 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-primary transition"
                      onClick={() => toggleBlock(user)}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="px-2 py-1 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition"
                      onClick={() => removeUser(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={userPagination.page}
          pages={userPagination.pages}
          onPageChange={(next) => fetchUsers(next)}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All expenses</h2>
        <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Title</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item._id} className="border-t border-gray-200 dark:border-slate-800">
                  <td className="p-3">{item.user?.username || "-"}</td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{formatRupee(item.amount)}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No expenses found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={expensePagination.page}
          pages={expensePagination.pages}
          onPageChange={(next) => fetchExpenses(next)}
        />
      </section>
    </div>
  );
}
