export const Home = () => {
  return (
    <div className="app-background">
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              Full Stack Application
            </div>

            <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Build something
              <span className="block text-indigo-600">great.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              A clean, modern application built with React, TypeScript, Tailwind
              CSS, and authentication flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Get started
              </a>

              <a
                href="/signin"
                className="rounded-xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
              >
                Sign in
              </a>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-slate-500">
              <div>
                <p className="font-semibold text-slate-900">TypeScript</p>
                <p>Type safe</p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <p className="font-semibold text-slate-900">React</p>
                <p>Modern UI</p>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <p className="font-semibold text-slate-900">Secure</p>
                <p>Authentication</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="glass-card relative mx-auto max-w-md rounded-3xl p-3">
              <div className="rounded-2xl bg-slate-950 p-8 shadow-2xl">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Welcome back</p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      Your dashboard
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/30" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div className="h-2 w-24 rounded-full bg-white/20" />
                    <div className="mt-3 h-2 w-40 rounded-full bg-white/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/20" />
                      <div className="mt-4 h-2 w-16 rounded-full bg-white/20" />
                    </div>

                    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="h-8 w-8 rounded-lg bg-sky-500/20" />
                      <div className="mt-4 h-2 w-16 rounded-full bg-white/20" />
                    </div>
                  </div>

                  <div className="rounded-xl bg-indigo-500 p-4">
                    <div className="h-2 w-20 rounded-full bg-white/40" />
                    <div className="mt-3 h-3 w-32 rounded-full bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
