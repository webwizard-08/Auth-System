import React from "react";

export default function ExpenseFilters({ filters, onChange, onReset }) {
  return (
    <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur p-4 rounded-xl shadow-md border border-indigo-100/70 dark:border-slate-800 grid md:grid-cols-5 gap-3">
      <input
        className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
        placeholder="Search title"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />
      <input
        className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
        placeholder="Category"
        value={filters.category}
        onChange={(e) => onChange({ category: e.target.value })}
      />
      <input
        className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
        type="date"
        value={filters.startDate}
        onChange={(e) => onChange({ startDate: e.target.value })}
      />
      <input
        className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-transparent focus:border-primary transition"
        type="date"
        value={filters.endDate}
        onChange={(e) => onChange({ endDate: e.target.value })}
      />
      <button
        onClick={onReset}
        className="border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:border-primary transition"
      >
        Reset
      </button>
    </div>
  );
}
