import { Link, useLocation, useNavigate } from "react-router-dom";

import { useLogout } from "../../hooks/auth/useLogout";
import { useAuthStore } from "../../store/auth.store";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const { mutate: logout, isLoading: isLogoutLoading } = useLogout();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch {
      // Error is handled by the logout hook.
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm text-white">
            F
          </span>

          <span>Full Stack Test</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {isAuthLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-100" />
          ) : isLoggedIn ? (
            <>
              {/* Home */}
              <Link
                to="/Home"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive("/Home")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Home
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="ml-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              {/* Sign in */}
              <Link
                to="/signin"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive("/signin")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                Sign in
              </Link>

              {/* Sign up */}
              <Link
                to="/signup"
                className="ml-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
