"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ExternalLink } from "lucide-react";

export default function RedirectPage() {
  const router = useRouter();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    // Redirect to amazon cart page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/amazon");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] bg-[#0F172A] px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-[#FF9900]/10 rounded-full flex items-center justify-center animate-pulse">
          <ShoppingCart size={48} className="text-[#FF9900]" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#00A8E1] rounded-full flex items-center justify-center">
          <ExternalLink size={14} className="text-white" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-center">
        Redirecting to Amazon Cart{dots}
      </h1>

      <p className="text-gray-400 text-lg text-center max-w-md mb-8">
        Your bundle products are being added to your Amazon cart.
      </p>

      <div className="w-full max-w-sm h-2 bg-[#1E293B] rounded-full overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-[#FF9900] to-[#00A8E1] rounded-full animate-[progress_2s_ease-in-out_infinite]" />
      </div>

      <p className="text-sm text-gray-500">
        Please do not close this window
      </p>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
