import React from "react";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  return (
    <div className="flex gap-2 items-center">
      <button
        className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-primary transition"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span className="text-sm text-gray-500">Page {page} of {pages}</span>
      <button
        className="px-3 py-1 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-primary transition"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
