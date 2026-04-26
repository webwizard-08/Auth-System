import React from "react";

export default function ExpenseTable({ items, onEdit, onDelete }) {
  const formatRupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-slate-800 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Category</th>
            <th className="p-3">Date</th>
            <th className="p-3">Notes</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t border-gray-200 dark:border-slate-800">
              <td className="p-3">{item.title}</td>
              <td className="p-3">{formatRupee(item.amount)}</td>
              <td className="p-3">{item.category}</td>
              <td className="p-3">{new Date(item.date).toLocaleDateString()}</td>
              <td className="p-3">{item.notes || "-"}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-2 py-1 border border-gray-300 dark:border-slate-700 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="px-2 py-1 border border-red-300 text-red-600 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No expenses yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
