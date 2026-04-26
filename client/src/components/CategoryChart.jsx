import React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function CategoryChart({ data }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 h-72">
      <h3 className="text-sm text-gray-600 dark:text-slate-300 mb-2">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data || []}>
          <XAxis dataKey="_id" stroke="#64748b" />
          <YAxis stroke="#64748b" tickFormatter={(value) => `₹${Number(value || 0).toLocaleString("en-IN")}`} />
          <Tooltip formatter={(value) => `₹${Number(value || 0).toLocaleString("en-IN")}`} />
          <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
