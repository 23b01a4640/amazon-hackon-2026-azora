"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { Clock, Search, Image, Target } from "lucide-react";

export default function RecentSearches() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from("search_history")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (!error && data) {
          setHistory(data);
        }
      } catch (err) {
        console.warn("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClick = (item) => {
    if (item.mode === "image") {
      // Can't re-run image search from history
      return;
    }
    if (item.mode === "product") {
      router.push(`/azora/questions?mode=adaptive&query=${encodeURIComponent(item.query)}`);
    } else {
      router.push(`/azora/questions?mission=${encodeURIComponent(item.mission)}`);
    }
  };

  const getModeIcon = (mode) => {
    if (mode === "image") return <Image size={14} className="text-[#FF9900]" />;
    if (mode === "product") return <Search size={14} className="text-[#00A8E1]" />;
    return <Target size={14} className="text-green-400" />;
  };

  if (loading || history.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
        <Clock size={14} /> Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-[#334155] hover:border-[#00A8E1] rounded-full text-sm text-gray-300 hover:text-white transition-colors"
          >
            {getModeIcon(item.mode)}
            <span className="truncate max-w-[150px]">{item.query}</span>
            {item.mission && item.mission !== "Direct Product" && item.mission !== "Unknown" && (
              <span className="text-xs text-[#FF9900] bg-[#FF9900]/10 px-1.5 py-0.5 rounded">
                {item.mission}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
