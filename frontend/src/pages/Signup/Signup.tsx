import { useNavigate } from "react-router-dom";
import { SignupForm } from "../../components/auth/SignupForm";

export const Signup = () => {
  const navigate = useNavigate();
  const handleSuccess = () => {
    navigate("/signin");
  };
  return (
    <div className="app-background">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
        <div className="glass-card w-full max-w-md rounded-3xl p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-lg">
              F
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Get started by creating your account
            </p>
          </div>

          <SignupForm onSuccess={handleSuccess} />

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
