import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import Navbar from "./Navbar.jsx";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-ink dark:text-white">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
