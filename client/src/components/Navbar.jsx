import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-lg font-semibold text-ink dark:text-white"
          >
            Expense Tracker
          </button>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm ${isActive ? "text-primary font-semibold" : "text-gray-500 dark:text-slate-300"}`
              }
            >
              Admin
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-slate-300 hidden sm:block">
            {user?.username}
          </span>
          <ThemeToggle />
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
