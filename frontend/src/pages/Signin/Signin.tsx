import { SigninForm } from "../../components/auth/SigninForm";

export const Signin = () => {
  return (
    <div className="app-background">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-lg">
              F
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to continue to your account
            </p>
          </div>

          <SigninForm />

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
