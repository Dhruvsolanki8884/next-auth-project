"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendForgotPasswordOtp,
  verifyOtpOnly,
  resetPasswordWithOtp,
} from "@/app/actions";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1); 

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await sendForgotPasswordOtp(email);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        setStep(2);
        setMessage("");
      }, 1000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await verifyOtpOnly(email, otp);

    if (result.success) {
      setStep(3);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const result = await resetPasswordWithOtp(email, otp, password);

    if (result.success) {
      setMessage("Password changed successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[30px] shadow-2xl p-8 w-full max-w-[420px] relative overflow-hidden">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
            {step === 1 && "📧"}
            {step === 2 && "🔢"}
            {step === 3 && "🔒"}
          </div>
        </div>

        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.push("/login"))}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 transition"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {step === 1
            ? "Forgot Password?"
            : step === 2
            ? "Verify OTP"
            : "Reset Password"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          {step === 1
            ? "Enter your email to receive a reset code."
            : step === 2
            ? `Enter the 6-digit code sent to ${email}`
            : "Create a new strong password."}
        </p>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="text-green-500 text-sm text-center bg-green-50 p-2 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 ml-1 text-center">
                ENTER 6-DIGIT CODE
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-blue-600 hover:underline"
              >
                Change Email
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
                NEW PASSWORD
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-bold mb-2 ml-1">
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 disabled:opacity-70"
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
