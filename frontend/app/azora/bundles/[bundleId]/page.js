"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProductsByMission } from "../../../services/api";
import ProductCard from "../../../components/ProductCard";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { ArrowLeft, ShieldCheck, Trash2, Plus, X } from "lucide-react";
import React from "react";

export default function BundleDetailsPage({ params }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const bundleId = unwrappedParams.bundleId;

  const [bundle, setBundle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [missionProducts, setMissionProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("selectedBundleDetail");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id === bundleId) {
        setBundle(parsed);
      } else {
        router.push("/azora/bundles");
      }
    } else {
      router.push("/azora/bundles");
    }
  }, [bundleId, router]);

  const handleRemoveProduct = (productId) => {
    setBundle((prev) => {
      const updatedProducts = prev.products.filter((p) => p.id !== productId);
      const updatedBundle = {
        ...prev,
        products: updatedProducts,
        price: updatedProducts.reduce((sum, p) => sum + p.price, 0),
        productCount: updatedProducts.length,
      };
      localStorage.setItem("selectedBundleDetail", JSON.stringify(updatedBundle));
      return updatedBundle;
    });
  };

  const handleAddProduct = async () => {
    setShowAddProduct(true);
    if (missionProducts.length === 0) {
      setLoadingProducts(true);
      try {
        const mission = localStorage.getItem("currentMission");
        if (mission) {
          const products = await getProductsByMission(mission);
          const bundleIds = bundle.products.map((p) => p.id);
          setMissionProducts(products.filter((p) => !bundleIds.includes(p.id)));
        }
      } catch (error) {
        console.error("Error fetching mission products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
  };

  const handleSelectProduct = (product) => {
    setBundle((prev) => {
      const updatedProducts = [...prev.products, product];
      const updatedBundle = {
        ...prev,
        products: updatedProducts,
        price: updatedProducts.reduce((sum, p) => sum + p.price, 0),
        productCount: updatedProducts.length,
      };
      localStorage.setItem("selectedBundleDetail", JSON.stringify(updatedBundle));
      return updatedBundle;
    });
    setMissionProducts((prev) => prev.filter((p) => p.id !== product.id));
    setShowAddProduct(false);
  };

  const handleCheckout = () => {
    localStorage.setItem("selectedBundle", JSON.stringify(bundle));
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/azora/checkout");
    }, 1500);
  };

  if (!bundle) return null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A] pb-32 pt-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#00A8E1] hover:text-[#FF9900] transition-colors mb-8 font-medium w-fit"
        >
          <ArrowLeft size={20} />
          Back to Recommendations
        </button>

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
            <div className="text-4xl font-extrabold text-[#00A8E1]">₹{bundle.price.toLocaleString()}</div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Products Included 
              <span className="bg-[#334155] text-white text-sm px-2 py-0.5 rounded-full">
                {bundle.products.length}
              </span>
            </h2>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A8E1] hover:bg-[#0089B8] text-white font-medium rounded-xl transition-colors"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          <div className="space-y-4">
            {bundle.products.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <button
                  onClick={() => handleRemoveProduct(product.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove from bundle"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {showAddProduct && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Add Product to Bundle</h3>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {loadingProducts ? (
                <div className="text-center py-8 text-gray-400">Loading available products...</div>
              ) : missionProducts.length > 0 ? (
                <div className="space-y-3">
                  {missionProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="flex items-center gap-4 p-4 border border-[#334155] rounded-xl hover:border-[#00A8E1] cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image_url || product.imageUrl || "https://via.placeholder.com/60"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-white"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-400">{product.brand || product.seller}</p>
                      </div>
                      <div className="text-[#00A8E1] font-bold">₹{product.price}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">No additional products available.</div>
              )}
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111827] border-t border-[#334155] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex flex-col">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Bundle Total</span>
              <div className="text-3xl font-extrabold text-white">₹{bundle.price.toLocaleString()}</div>
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
