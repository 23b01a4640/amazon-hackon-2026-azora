"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBundles, smartSearchProducts } from "../../services/api";
import { supabase } from "../../lib/supabase";
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
  const [imageResults, setImageResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (mode === "image") {
          // Image search results from localStorage
          const saved = localStorage.getItem("imageSearchResults");
          if (saved) {
            setImageResults(JSON.parse(saved));
          }
        } else if (mode === "search" && query) {
          // Get user answers from localStorage (set by questions page)
          const savedAnswers = localStorage.getItem("userAnswers");
          const answers = savedAnswers ? JSON.parse(savedAnswers) : [];
          // Get user_id for repurchase-aware filtering
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id || null;
          const products = await smartSearchProducts(query, answers, userId);
          setSearchResults(products);
        } else if (mission) {
          // Get user_id for personalized bundles
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id || null;
          const data = await getBundles(mission, userId);
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

  // Image search results view
  if (mode === "image" && imageResults) {
    const imageProducts = imageResults.products || [];
    const isAllImageSelected = imageProducts.length > 0 && selectedProducts.length === imageProducts.length;

    const toggleSelectProduct = (product) => {
      setSelectedProducts((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        if (exists) {
          return prev.filter((p) => p.id !== product.id);
        }
        return [...prev, product];
      });
    };

    const toggleSelectAll = () => {
      if (isAllImageSelected) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts([...imageProducts]);
      }
    };

    const handleAddToCart = (product) => {
      const bundle = {
        id: "image-search",
        name: "Selected Products",
        description: "Products from image search",
        products: [product],
        price: product.price,
        productCount: 1,
      };
      localStorage.setItem("selectedBundle", JSON.stringify(bundle));
      router.push("/amazon");
    };

    const handleAddSelectedToCart = () => {
      if (selectedProducts.length === 0) return;
      const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      const bundle = {
        id: "image-search",
        name: "Selected Products",
        description: "Products from image search",
        products: selectedProducts,
        price: totalPrice,
        productCount: selectedProducts.length,
      };
      localStorage.setItem("selectedBundle", JSON.stringify(bundle));
      router.push("/amazon");
    };

    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-12 pt-8">
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#00A8E1] mb-4 flex items-center justify-center gap-3">
            {imageResults.intent === "similar" && "Similar Products"}
            {imageResults.intent === "complementary" && "Complementary Products"}
            {imageResults.intent === "bundle" && "Recommended Bundle"}
            {!imageResults.intent && "Image Search Results"}
          </h1>
          {imageResults.detected_product && (
            <p className="text-lg text-gray-300 mb-2">
              Detected: <span className="text-[#FF9900] font-bold">{imageResults.detected_product}</span>
              {imageResults.target_category && (
                <span className="text-gray-400"> → Looking for: <span className="text-[#00A8E1] font-bold">{imageResults.target_category}</span></span>
              )}
            </p>
          )}
          {imageResults.detected_categories && imageResults.detected_categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {imageResults.detected_categories.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-[#1E293B] border border-[#334155] text-[#00A8E1] text-sm font-medium rounded-full">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <p className="text-gray-400 mt-4">
            {imageProducts.length} product{imageProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4">
          {imageProducts.length > 0 ? (
            <>
              {/* Select All + Add Selected Bar */}
              <div className="flex items-center justify-between mb-4 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllImageSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 accent-[#FF9900] cursor-pointer rounded"
                  />
                  <span className="text-white font-medium text-sm">
                    Select All ({imageProducts.length})
                  </span>
                </label>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleAddSelectedToCart}
                    className="px-5 py-2.5 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg flex items-center gap-2"
                  >
                    Add {selectedProducts.length} to Cart - ₹{selectedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {imageProducts.map((product) => {
                  const isSelected = selectedProducts.some((p) => p.id === product.id);
                  return (
                    <div key={product.id} className={`relative flex items-start gap-3 p-3 rounded-xl border transition-colors ${isSelected ? "border-[#FF9900] bg-[#FF9900]/5" : "border-transparent"}`}>
                      <div className="flex items-center pt-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(product)}
                          className="w-5 h-5 accent-[#FF9900] cursor-pointer rounded"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <ProductCard product={product} />
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="absolute top-4 right-4 px-4 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky bottom bar when items are selected */}
              {selectedProducts.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] p-4 flex items-center justify-between z-50 shadow-2xl">
                  <span className="text-white font-medium">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected - Total: <span className="text-[#FF9900] font-bold">₹{selectedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</span>
                  </span>
                  <button
                    onClick={handleAddSelectedToCart}
                    className="px-6 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg"
                  >
                    Add Selected to Cart
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-16">
              <p className="text-xl mb-2">No products found</p>
              <p>Try uploading a different image.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === "search") {
    const isAllSelected = searchResults.length > 0 && selectedProducts.length === searchResults.length;

    const toggleSelectProduct = (product) => {
      setSelectedProducts((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        if (exists) {
          return prev.filter((p) => p.id !== product.id);
        }
        return [...prev, product];
      });
    };

    const toggleSelectAll = () => {
      if (isAllSelected) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts([...searchResults]);
      }
    };

    const handleAddToCart = (product) => {
      const bundle = {
        id: "direct-search",
        name: "Selected Products",
        description: "Products from your search",
        products: [product],
        price: product.price,
        productCount: 1,
      };
      localStorage.setItem("selectedBundle", JSON.stringify(bundle));
      router.push("/amazon");
    };

    const handleAddSelectedToCart = () => {
      if (selectedProducts.length === 0) return;
      const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      const bundle = {
        id: "direct-search",
        name: "Selected Products",
        description: "Products from your search",
        products: selectedProducts,
        price: totalPrice,
        productCount: selectedProducts.length,
      };
      localStorage.setItem("selectedBundle", JSON.stringify(bundle));
      router.push("/amazon");
    };

    return (
      <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-12 pt-8">
        <div className="text-center mb-8 px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#00A8E1] mb-4 flex items-center justify-center gap-3">
            <Search className="text-[#00A8E1]" size={32} /> Results for &quot;{query}&quot;
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {searchResults.length} product{searchResults.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto px-4">
          {searchResults.length > 0 ? (
            <>
              {/* Select All + Add Selected Bar */}
              <div className="flex items-center justify-between mb-4 p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 accent-[#FF9900] cursor-pointer rounded"
                  />
                  <span className="text-white font-medium text-sm">
                    Select All ({searchResults.length})
                  </span>
                </label>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleAddSelectedToCart}
                    className="px-5 py-2.5 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg flex items-center gap-2"
                  >
                    Add {selectedProducts.length} to Cart - ₹{selectedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {searchResults.map((product) => {
                  const isSelected = selectedProducts.some((p) => p.id === product.id);
                  return (
                    <div key={product.id} className={`relative flex items-start gap-3 p-3 rounded-xl border transition-colors ${isSelected ? "border-[#FF9900] bg-[#FF9900]/5" : "border-transparent"}`}>
                      {/* Checkbox */}
                      <div className="flex items-center pt-12">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(product)}
                          className="w-5 h-5 accent-[#FF9900] cursor-pointer rounded"
                        />
                      </div>
                      {/* Product Card */}
                      <div className="flex-1 relative">
                        <ProductCard product={product} />
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="absolute top-4 right-4 px-4 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticky bottom bar when items are selected */}
              {selectedProducts.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] p-4 flex items-center justify-between z-50 shadow-2xl">
                  <span className="text-white font-medium">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected - Total: <span className="text-[#FF9900] font-bold">₹{selectedProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}</span>
                  </span>
                  <button
                    onClick={handleAddSelectedToCart}
                    className="px-6 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-lg text-sm transition-colors shadow-lg"
                  >
                    Add Selected to Cart
                  </button>
                </div>
              )}
            </>
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
