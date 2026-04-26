import React from "react";

function formatRupee(amount) {
  const formatted = Number(amount || 0).toLocaleString("en-IN");
  return `₹${formatted}`;
}

export default function ExpenseList({ items, onEdit, onDelete, showActions = true }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-200 dark:border-slate-700">
      {items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition duration-300"
        >
          <div>
            <p className="font-medium text-ink dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {item.category} • {new Date(item.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-ink dark:text-white">
              {formatRupee(item.amount)}
            </span>
            {showActions && (
              <>
                <button
                  onClick={() => onEdit(item)}
                  className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-indigo-500 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition duration-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-gray-500">
          No expenses yet.
        </div>
      )}
    </div>
  );
}
