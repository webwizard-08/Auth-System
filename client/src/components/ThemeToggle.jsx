import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-slate-200 hover:border-primary transition"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
