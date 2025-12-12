"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp, resendOtp } from "@/app/actions";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Timer for Resend
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Input Change for Split Inputs
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await verifyOtp(email, finalOtp);

      if (result.success) {
        setMessage("Verification Successful! Logging you in...");
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setError("");
    setMessage("");

    try {
      const result = await resendOtp(email);
      if (result.success) {
        setMessage(result.message);
        setTimer(30); // Reset timer
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <p className="text-gray-700 mb-4">No email provided.</p>
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F6] p-4">
      <div className="bg-white rounded-[32px] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.1)] p-8 sm:p-10 w-full max-w-[480px]">
        {/* Icon */}
        <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-2">
          Verification
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          We have sent a verification code to <br />
          <span className="font-semibold text-gray-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-14 sm:h-16 border-2 border-gray-200 rounded-xl text-center text-xl sm:text-2xl font-bold text-gray-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-xl border border-red-100">
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-xl border border-green-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-transform active:scale-[0.98] shadow-xl disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              className={`font-bold hover:underline ${
                timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
              }`}
              onClick={handleResend}
              disabled={timer > 0 || resending}
            >
              {resending
                ? "Sending..."
                : timer > 0
                ? `Resend in ${timer}s`
                : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
