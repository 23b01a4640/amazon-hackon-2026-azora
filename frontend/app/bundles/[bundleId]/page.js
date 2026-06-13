"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bundles } from "../../data/mockBundles";
import ProductCard from "../../components/ProductCard";
import TrustLayer from "../../components/TrustLayer";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import React from "react";

export default function BundleDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const bundleId = unwrappedParams.bundleId;
  const [bundle, setBundle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const found = bundles.find((b) => b.id === bundleId);
    if (found) {
      setBundle(found);
    } else {
      router.push("/bundles");
    }
  }, [bundleId, router]);

  const handleCheckout = () => {
    localStorage.setItem("selectedBundle", JSON.stringify(bundle));
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

  if (!bundle) return null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-32 pt-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#00A8E1] hover:text-[#FF9900] transition-colors mb-8 font-medium w-fit"
        >
          <ArrowLeft size={20} />
          Back to Recommendations
        </button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#334155] pb-6 mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wider">
                {bundle.name} Bundle
              </h1>
              {bundle.recommended && (
                <span className="bg-[#FF9900] text-[#111827] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Recommended
                </span>
              )}
            </div>
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#00A8E1]" />
              {bundle.description}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
            <span className="text-sm text-gray-400 font-medium uppercase tracking-wider mb-1">Bundle Total</span>
            <div className="text-4xl font-extrabold text-[#00A8E1]">₹{bundle.price}</div>
          </div>
        </div>

        {/* Products List */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            Products Included 
            <span className="bg-[#334155] text-white text-sm px-2 py-0.5 rounded-full">
              {bundle.products.length}
            </span>
          </h2>
          <div className="space-y-4">
            {bundle.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-2">Budget Match</span>
            <div className="text-3xl font-extrabold text-[#FF9900]">{bundle.metrics.budgetMatch}%</div>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-2">Coverage</span>
            <div className="text-3xl font-extrabold text-[#FF9900]">{bundle.metrics.coverageScore}%</div>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-2">Quality</span>
            <div className="text-3xl font-extrabold text-[#00A8E1]">{bundle.metrics.qualityScore}%</div>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider mb-2">Value</span>
            <div className="text-3xl font-extrabold text-[#00A8E1]">{bundle.metrics.valueScore}%</div>
          </div>
        </div>

        {/* Trust Layer */}
        <div className="mb-12 border border-[#334155] rounded-2xl overflow-hidden bg-[#1E293B]">
           <TrustLayer bundle={bundle} />
        </div>

        {/* Sticky Checkout Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111827] border-t border-[#334155] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex flex-col">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Bundle Total</span>
              <div className="text-3xl font-extrabold text-white">₹{bundle.price}</div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full md:w-auto px-12 py-4 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-xl text-lg transition-colors shadow-[0_4px_14px_0_rgba(255,153,0,0.39)]"
            >
              Checkout Bundle
            </button>
          </div>
        </div>

      </div>

      <LoadingOverlay 
        isLoading={isSubmitting} 
        message="⏳ Preparing checkout..." 
      />
    </div>
  );
}
