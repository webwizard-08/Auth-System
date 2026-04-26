import React from "react";

export default function SummaryCards({ weekly, monthly }) {
  const formatRupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Weekly total</p>
        <p className="text-2xl font-semibold">{formatRupee(weekly?.total)}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Monthly total</p>
        <p className="text-2xl font-semibold">{formatRupee(monthly?.total)}</p>
      </div>
    </div>
  );
}
