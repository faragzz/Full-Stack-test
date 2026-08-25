import { Link } from "react-router-dom";

import { useMe } from "../../hooks/auth/useMe";

export const Home = () => {
  const { greeting, isLoading, error } = useMe();

  return (
    <div className="app-background">
      <div className="relative mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-6 py-12">
        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

              <p className="text-sm text-slate-500">Loading your profile...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="glass-card w-full max-w-md rounded-3xl p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🔒
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Welcome</h1>

              <p className="mt-3 text-slate-500">
                Please sign in to access your personalized page.
              </p>

              <Link
                to="/signin"
                className="mt-6 inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="pt-10">
            {/* Greeting */}
            <div className="mb-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                Your dashboard
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {greeting}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                We're glad to have you here. Your account is securely
                authenticated and ready to go.
              </p>
            </div>

            {/* Main card */}
            <div className="glass-card overflow-hidden rounded-3xl">
              <div className="p-8 sm:p-10">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                      👋
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900">
                      Welcome back!
                    </h2>

                    <p className="mt-3 max-w-xl leading-7 text-slate-500">
                      You've successfully authenticated with the application.
                      Your session is being securely managed through HTTP-only
                      cookies.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />

                    <div>
                      <p className="text-sm font-semibold text-emerald-700">
                        Authenticated
                      </p>

                      <p className="text-xs text-emerald-600">Session active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  🔐
                </div>

                <h3 className="font-semibold text-slate-900">
                  Secure authentication
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Authentication is handled securely using HTTP-only cookies.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  ⚡
                </div>

                <h3 className="font-semibold text-slate-900">
                  Fast experience
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  A responsive React application with a clean and modern UI.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  ✓
                </div>

                <h3 className="font-semibold text-slate-900">Full stack</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Connected to your NestJS backend and MongoDB database.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
