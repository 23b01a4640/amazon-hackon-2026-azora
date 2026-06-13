"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutSummary from "../../components/CheckoutSummary";
import ProductCheckoutCard from "../../components/ProductCheckoutCard";
import SavingsCard from "../../components/SavingsCard";
import CheckoutCTA from "../../components/CheckoutCTA";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [bundle, setBundle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("⏳ Preparing your bundle...");

  useEffect(() => {
    const saved = localStorage.getItem("selectedBundle");
    if (saved) {
      setBundle(JSON.parse(saved));
    } else {
      router.push("/azora/bundles");
    }
  }, [router]);

  const handleProceed = () => {
    setIsSubmitting(true);
    setLoadingMessage("🛒 Adding products to cart...");
    
    setTimeout(() => {
      router.push("/azora/redirect");
    }, 1500);
  };

  if (!bundle) return null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-32 pt-8">
      <div className="w-full max-w-2xl mx-auto px-4">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#00A8E1] hover:text-[#FF9900] transition-colors mb-8 font-medium w-fit"
        >
          <ArrowLeft size={20} />
          Back to Bundle Details
        </button>

        <CheckoutSummary bundle={bundle} />

        <div className="mb-8 bg-[#111827] border border-[#334155] rounded-xl overflow-hidden shadow-sm">
          <h3 className="text-white text-sm font-bold p-4 border-b border-[#334155] uppercase tracking-wider bg-[#1E293B]">
            Products Included ({bundle.products.length})
          </h3>
          <div className="flex flex-col">
            {bundle.products.map((product) => (
              <ProductCheckoutCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <SavingsCard bundle={bundle} />

      </div>

      <CheckoutCTA bundle={bundle} onProceed={handleProceed} />

      <LoadingOverlay 
        isLoading={isSubmitting} 
        message={loadingMessage} 
      />
    </div>
  );
}
