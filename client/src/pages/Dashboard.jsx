import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import Toast from "../components/Toast.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const toastFromState = location.state?.toast;
    if (toastFromState) {
      setToast(toastFromState);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/auth/get-me");
        if (isMounted) {
          setProfile(response.data);
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || "Failed to load profile";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ea] via-[#fff5e6] to-[#f0d9c7] px-6 py-12 text-ink">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[32px] border border-white/60 bg-white/90 p-10 shadow-glass backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cobalt">
                Dashboard
              </p>
              <h1 className="mt-3 font-display text-3xl">Profile overview</h1>
              <p className="mt-2 text-sm text-[#5b5b55]">
                This data comes from the protected endpoint.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-[#e8dcc9] bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Logout
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-[#efe7d8] bg-[#fffaf2] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-terracotta">
                Protected data
              </p>
              {loading ? (
                <p className="mt-4 text-sm text-[#5b5b55]">Loading profile...</p>
              ) : error ? (
                <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              ) : (
                <pre className="mt-4 max-h-[320px] overflow-auto rounded-2xl bg-[#13110f] p-5 text-sm text-[#fef3dd]">
                  {JSON.stringify(profile, null, 2)}
                </pre>
              )}
            </div>
            <div className="rounded-2xl border border-[#efe7d8] bg-white p-6">
              <h2 className="font-display text-xl">Quick tips</h2>
              <ul className="mt-4 grid gap-3 text-sm text-[#5b5b55]">
                <li>Token is stored in localStorage as accessToken.</li>
                <li>Dashboard uses /api/auth/get-me with Authorization header.</li>
                <li>Logout clears the token and redirects to login.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Toast
        type={toast?.type}
        message={toast?.message}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
