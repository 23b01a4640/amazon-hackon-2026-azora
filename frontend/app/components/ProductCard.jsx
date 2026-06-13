import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  // Support both mock format (imageUrl, seller) and backend format (image_url, brand)
  const name = product.name;
  const seller = product.seller || product.brand || "Amazon";
  const imageUrl = product.imageUrl || product.image_url || "https://via.placeholder.com/200";
  const price = product.price;
  const rating = product.rating || 4.0;
  const reviewCount = product.reviewCount || product.reviews || 0;
  const description = product.description || "";
  const amazonUrl = product.amazonUrl || "#";

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border border-[#334155] rounded-xl bg-[#1E293B] transition-colors hover:bg-[#1E293B]/80">
      {/* Image */}
      <div className="w-full md:w-48 h-48 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 relative group">
        <img 
          src={imageUrl} 
          alt={name} 
          className="object-cover w-full h-full rounded transition-transform duration-300 group-hover:scale-105" 
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 py-2">
        <h3 className="text-xl font-medium text-white mb-1 hover:text-[#FF9900] cursor-pointer transition-colors line-clamp-2">
          {name}
        </h3>
        <p className="text-sm text-[#00A8E1] mb-2 font-medium">by {seller}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-[#FF9900]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                className={i < Math.floor(rating) ? "text-[#FF9900]" : "text-gray-500"}
              />
            ))}
          </div>
          <span className="text-gray-300 text-sm ml-1">{rating}</span>
          <span className="text-[#00A8E1] text-sm ml-2 hover:underline cursor-pointer">{reviewCount} ratings</span>
        </div>

        {/* Price */}
        <div className="flex items-start mb-3">
          <span className="text-sm text-gray-300 mt-1 font-medium">₹</span>
          <span className="text-3xl font-medium text-white tracking-tight">{price}</span>
        </div>

        <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{description}</p>

        <div className="mt-auto pt-2 border-t border-[#334155]/50 flex justify-between items-center">
          <a
            href={amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-transparent hover:bg-[#334155] text-white border border-[#334155] font-medium rounded-full text-sm transition-colors"
          >
            View Details
          </a>
          <span className="text-xs text-[#FF9900] font-medium bg-[#FF9900]/10 px-2 py-1 rounded">
            Amazon Choice
          </span>
        </div>
      </div>
    </div>
  );
}
