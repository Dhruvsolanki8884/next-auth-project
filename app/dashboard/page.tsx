"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  name: string;
}
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (

    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans">
     
      <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl w-full max-w-4xl p-8 md:p-10 relative z-10 border border-white/60">

        <div className="flex justify-between items-start mb-8">
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 text-gray-700 hover:text-red-500 font-semibold bg-gray-100 hover:bg-red-50 px-5 py-2.5 rounded-full transition-all duration-300"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Logout</span>
          </button>

          <h2 className="text-xl font-bold text-gray-300 tracking-wider">
            AUTHAPP
          </h2>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {user.name}
            </span>
            !
          </h1>
          <p className="text-gray-500 text-lg">
            Here is your account overview.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md border-4 border-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <span className="bg-white text-green-500 px-4 py-2 rounded-xl text-sm font-bold shadow-sm border border-green-100">
              ✅ Verified
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-black text-blue-500 mb-1">12</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Projects
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-black text-purple-500 mb-1">5</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Active Tasks
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl font-black text-orange-500 mb-1">9+</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Alerts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
