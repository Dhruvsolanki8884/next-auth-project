import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Welcome</h1>
        <p className="text-gray-500 text-sm mb-8">
          Choose an option to continue
        </p>
        <div className="space-y-3">
          <Link
            href="/signup"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="block w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
