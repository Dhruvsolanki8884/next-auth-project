"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/actions";
import { use } from "react"; 

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const result = await resetPassword(token, password);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => router.push("/login"), 3000); 
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-400 to-cyan-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-[30px] shadow-xl p-8 w-full max-w-[400px]">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mb-6">Create your new password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
        
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-blue-50 border-none text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-blue-50 border-none text-gray-900 focus:ring-2 focus:ring-blue-500"
              placeholder="Repeat password"
            />
          </div>

          {message && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#3B82F6] text-white rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-70"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
