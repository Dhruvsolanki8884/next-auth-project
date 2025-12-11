"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions";

const COUNTRIES = [
  { code: "IN", dial_code: "+91", flag: "🇮🇳" },
  { code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { code: "US", dial_code: "+1", flag: "🇺🇸" },
  { code: "CA", dial_code: "+1", flag: "🇨🇦" },
  { code: "AU", dial_code: "+61", flag: "🇦🇺" },
  { code: "DE", dial_code: "+49", flag: "🇩🇪" },
  { code: "FR", dial_code: "+33", flag: "🇫🇷" },
];

interface FormData {
  fullName: string;
  email: string;
  birthDate: string;
  countryCode: string;
  phone: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  password?: string;
  submit?: string;
}

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    birthDate: "",
    countryCode: "+91",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "Date is required";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Min 6 chars";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const finalUserData = {
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      };
      const result = await registerUser(finalUserData);

      if (result.success) {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: "Something went wrong." });
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

        <h1 className="text-[32px] font-bold text-gray-900 mb-1">Sign up</h1>
        <p className="text-gray-500 text-sm mb-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full h-12 px-4 rounded-xl bg-gray-50 border ${
                errors.fullName ? "border-red-500" : "border-gray-200"
              } text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-[10px] ml-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 px-4 rounded-xl bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-200"
              } text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] ml-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Birth of date
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full h-12 px-4 rounded-xl bg-gray-50 border ${
                errors.birthDate ? "border-red-500" : "border-gray-200"
              } text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium uppercase`}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-[10px] ml-1">
                {errors.birthDate}
              </p>
            )}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="h-12 pl-3 pr-8 appearance-none bg-gray-50 border border-gray-200 rounded-xl text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.dial_code}>
                      {c.flag} {c.dial_code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 1L5 5L9 1" />
                  </svg>
                </div>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`flex-1 h-12 px-4 rounded-xl bg-gray-50 border ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400`}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-[10px] ml-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1.5 ml-1">
              Set Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="*******"
                value={formData.password}
                onChange={handleChange}
                className={`w-full h-12 px-4 pr-10 rounded-xl bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } text-gray-900 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-400`}
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
            {errors.password && (
              <p className="text-red-500 text-[10px] ml-1">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="text-center text-red-500 text-xs bg-red-50 p-2 rounded-lg">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#3B82F6] text-white rounded-xl font-bold text-base hover:bg-blue-600 transition shadow-[0_4px_14px_rgba(59,130,246,0.4)] mt-2 disabled:opacity-70"
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
