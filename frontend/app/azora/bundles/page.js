"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBundles, searchProducts } from "../../services/api";
import BundleCard from "../../components/BundleCard";
import ProductCard from "../../components/ProductCard";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Home, Search } from "lucide-react";

function BundlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mission = searchParams.get("mission");
  const mode = searchParams.get("mode");
  const query = searchParams.get("query");

  const [bundleData, setBundleData] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === "search" && query) {
          const products = await searchProducts(query);
          setSearchResults(products);
        } else if (mission) {
          const data = await getBundles(mission);
          setBundleData(data);
        } else {
          router.push("/azora");
          return;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load results. Please try again.");
        router.push("/azora");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mission, mode, query, router]);

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="⏳ Generating recommendations..." />;
  }

  if (mode === "search") {
    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-12 pt-8">
        <div className="text-center mb-16 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#00A8E1] mb-4 flex items-center justify-center gap-3">
            <Search className="text-[#00A8E1]" size={32} /> Results for &quot;{query}&quot;
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {searchResults.length} product{searchResults.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <p className="text-xl mb-2">No products found</p>
              <p>Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!bundleData) return null;

  const bundles = [
    {
      id: "essentials",
      name: "Essentials",
      description: "Covers Basics — Lowest cost options",
      recommended: false,
      products: bundleData.essentials || [],
      price: (bundleData.essentials || []).reduce((sum, p) => sum + p.price, 0),
      productCount: (bundleData.essentials || []).length,
    },
    {
      id: "best-value",
      name: "Best Value",
      description: "Best Balance — Quality meets affordability",
      recommended: true,
      products: bundleData.best_value || [],
      price: (bundleData.best_value || []).reduce((sum, p) => sum + p.price, 0),
      productCount: (bundleData.best_value || []).length,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Highest Quality — Top-tier products",
      recommended: false,
      products: bundleData.premium || [],
      price: (bundleData.premium || []).reduce((sum, p) => sum + p.price, 0),
      productCount: (bundleData.premium || []).length,
    },
  ];

  const handleSelectBundle = (bundle) => {
    localStorage.setItem("selectedBundleDetail", JSON.stringify(bundle));
    localStorage.setItem("currentMission", mission);
    router.push(`/azora/bundles/${bundle.id}`);
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-12 pt-8">
      <div className="text-center mb-16 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#00A8E1] mb-4 flex items-center justify-center gap-3">
          <Home className="text-[#00A8E1]" size={32} /> {mission}
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          We&apos;ve prepared bundles based on your preferences and budget.
        </p>
      </div>

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

export default function BundlesPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} message="⏳ Loading bundles..." />}>
      <BundlesContent />
    </Suspense>
  );
}
