"use client";

import { useRouter } from "next/navigation";
import { bundles } from "../data/mockBundles";
import BundleCard from "../components/BundleCard";
import { Home } from "lucide-react";

export default function BundlesPage() {
  const router = useRouter();

  const handleSelectBundle = (bundle) => {
    router.push(`/bundles/${bundle.id}`);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-12 pt-8">
      
      {/* Goal Summary */}
      <div className="text-center mb-16 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00A8E1] mb-4 flex items-center justify-center gap-3">
          <Home className="text-[#00A8E1]" size={32} /> New Apartment Setup
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          We've prepared bundles based on your preferences and budget.
        </p>
      </div>

      {/* Bundle Recommendation Cards */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {bundles.map((bundle) => (
            <div 
              key={bundle.id} 
              className={bundle.recommended ? "lg:-mt-4 lg:mb-4 relative z-10" : "mt-0"}
            >
              <BundleCard 
                bundle={bundle} 
                isSelected={false}
                onSelect={handleSelectBundle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
