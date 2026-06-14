"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-8 px-4">
      {/* Amazon Logo */}
      <div className="mb-6">
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-[#131921] tracking-tight">amazon</span>
          <span className="text-xs text-gray-500 ml-0.5">.in</span>
        </div>
        <div className="h-[3px] w-20 mx-auto bg-[#FF9900] rounded-full mt-[-2px]"></div>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-[350px] border border-[#ddd] rounded-lg p-6 shadow-sm">
        <h1 className="text-[28px] font-normal text-[#131921] mb-5">Create account</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-start gap-2">
            <span className="text-red-500 mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-[#131921] mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last name"
              className="w-full px-3 py-[7px] border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm text-[#131921]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#131921] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-[7px] border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm text-[#131921]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#131921] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-[7px] border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm text-[#131921]"
            />
            <p className="text-xs text-gray-500 mt-1">ℹ Passwords must be at least 6 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#131921] mb-1">Re-enter password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-[7px] border border-[#a6a6a6] rounded-[3px] focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] text-sm text-[#131921]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[7px] bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] rounded-[3px] text-sm font-normal text-[#131921] hover:from-[#f5d78e] hover:to-[#eeb933] cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>

        <p className="text-xs text-[#131921] mt-5 leading-5">
          By creating an account, you agree to Amazon&apos;s{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">Conditions of Use</span> and{" "}
          <span className="text-[#0066c0] cursor-pointer hover:text-[#c45500] hover:underline">Privacy Notice</span>.
        </p>

        <div className="mt-5 pt-4 border-t border-[#e7e7e7]">
          <p className="text-sm text-[#131921]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>


    </div>
  );
}
