import RecommendationBadge from "./RecommendationBadge";
import { Package } from "lucide-react";

export default function BundleCard({ bundle, isSelected, onSelect }) {
  const { name, price, recommended, description, productCount } = bundle;
  
  return (
    <div 
      className={`relative flex flex-col p-6 rounded-2xl bg-[#1E293B] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(0,168,225,0.3)] ${
        isSelected ? "border-2 border-[#FF9900]" : "border border-[#334155]"
      }`}
    >
      {recommended && <RecommendationBadge />}
      
      <div className="text-center mt-2 mb-6">
        <h3 className="text-2xl font-bold text-white uppercase tracking-wider">{name}</h3>
        <div className="text-4xl font-extrabold text-[#00A8E1] mt-4">₹{price}</div>
      </div>

      <div className="flex-1 text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-gray-300 font-medium mb-4">
          <Package size={20} className="text-[#FF9900]" />
          <span>{productCount} Products Included</span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      <button
        onClick={() => onSelect(bundle)}
        className={`w-full py-4 rounded-xl font-bold transition-colors ${
          recommended 
            ? "bg-[#FF9900] hover:bg-[#e68a00] text-[#111827]" 
            : "bg-[#00A8E1] hover:bg-[#0089B8] text-white"
        }`}
      >
        View Bundle →
      </button>
    </div>
  );
}
