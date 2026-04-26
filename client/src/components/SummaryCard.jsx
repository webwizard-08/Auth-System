import React from "react";

export default function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl shadow-md p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-slate-300">{title}</p>
        {Icon && <Icon className="h-5 w-5 text-gray-400 dark:text-slate-300" />}
      </div>
      <p className="text-2xl font-semibold mt-2 text-indigo-600 dark:text-indigo-400">{value}</p>
    </div>
  );
}
