"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <nav className="w-full bg-[#111827] text-white border-b border-[#1E293B] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex justify-between items-center">
        <Link href="/azora" className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#00A8E1]">
          Azora
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/azora" className="font-semibold hover:text-[#00A8E1] transition-colors hidden sm:inline">Home</Link>
          <Link href="/" className="font-semibold hover:text-[#00A8E1] transition-colors hidden sm:inline">Amazon</Link>
          
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300 hidden md:inline">
                Hi, <span className="text-[#FF9900] font-medium">{displayName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#1E293B] hover:bg-[#334155] border border-[#334155] rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
