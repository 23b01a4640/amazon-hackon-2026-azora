import { Star } from "lucide-react";

export default function ProductCheckoutCard({ product }) {
  const imageUrl = product.imageUrl || product.image_url || "https://via.placeholder.com/80";
  const seller = product.seller || product.brand || "Amazon";
  const rating = product.rating || 4.0;
  const reviewCount = product.reviewCount || product.reviews || 0;

  return (
    <div className="flex flex-row gap-4 p-4 border-b border-[#334155] bg-[#111827] items-center last:border-b-0">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover rounded" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm md:text-base truncate mb-1">{product.name}</h4>
        <p className="text-xs text-gray-400 mb-2 truncate">Seller: {seller}</p>
        <div className="flex items-center gap-1 text-xs text-gray-300">
          <Star size={12} className="text-[#FF9900]" fill="currentColor" />
          <span className="text-[#FF9900] font-bold">{rating}</span>
          <span className="hidden sm:inline">({reviewCount.toLocaleString()} reviews)</span>
        </div>
      </div>
      <div className="text-white font-bold text-base md:text-lg whitespace-nowrap pl-2">
        ₹{product.price.toLocaleString()}
      </div>
    </div>
  );
}
