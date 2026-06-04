import { useForm } from "react-hook-form";
import { useAuth, type LoginInput } from "../hooks/useAuth";
import { Package, ShieldAlert, Loader2, Mail, Lock } from "lucide-react";
import { normalizeError } from "../utils/formatError";

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginInput) {
    login(data);
  }

  const errorMessage = normalizeError(loginError);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b0f19] text-[#e2e8f0] font-sans">
      <div className="w-full max-w-md p-8 bg-[#0f172a] rounded-2xl border border-[#1e293b] shadow-xl space-y-6">
        {/* Brand Header Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <Package size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-2 m-0">
            Welcome to StockCenter
          </h1>
          <p className="text-sm text-slate-400 m-0">
            Sign in to access centralized inventory management
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-sm">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <p className="m-0 font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                disabled={isLoggingIn}
                {...register("email", {
                  required: "Email field is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full bg-[#0b0f19] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.email
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-[#1e293b]"
                }`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-400 font-medium">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                disabled={isLoggingIn}
                {...register("password", {
                  required: "Password field is required",
                })}
                className={`w-full bg-[#0b0f19] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.password
                    ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                    : "border-[#1e293b]"
                }`}
              />
            </div>
            {errors.password && (
              <span className="text-xs text-rose-400 font-medium">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Anchor Actions */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-none mt-6"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
