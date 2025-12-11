"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginUser } from "@/app/actions";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard");
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] px-4 py-6">
      <div className="bg-white rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-8 w-full relative">
        <button
          onClick={() => router.push("/")}
          className="mb-6 hover:opacity-60 transition text-black"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-[32px] font-bold text-gray-900 text-center mb-1">
          Login
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Loisbecket@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="*******"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-500 text-xs font-medium">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>
          {error && (
            <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#3B82F6] text-white rounded-xl font-bold text-base hover:bg-blue-600 transition shadow-[0_4px_14px_rgba(59,130,246,0.4)] disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium">
                Or
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.743-.067-1.47-.188-2.175H12v4.513h6.915a6.552 6.552 0 0 1-2.585 4.492v3.23h4.195c2.454-2.276 3.82-5.748 3.82-9.06z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.957-1.038 7.94-2.84l-4.195-3.23c-1.075.72-2.45 1.145-3.745 1.145-2.905 0-5.385-1.96-6.265-4.71H1.547v3.31A11.996 11.996 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.735 14.363a7.228 7.228 0 0 1 0-4.726V6.327H1.547a11.996 11.996 0 0 0 0 11.346l4.188-3.31z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.772c1.763 0 3.348.608 4.593 1.796l3.45-3.45C17.952 1.188 15.236 0 12 0 7.37 0 3.327 2.652 1.547 6.327l4.188 3.31C6.615 6.733 9.095 4.772 12 4.772z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Continue with Google
              </span>
            </button>
            <button
              type="button"
              className="w-full h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.0 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99C18.34 21.13 22 17.0 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                Continue with Facebook
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
