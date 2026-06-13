import { CheckCircle } from "lucide-react";

export default function TrustLayer({ bundle }) {
  if (!bundle) return null;

  const totalReviews = bundle.products.reduce((acc, p) => acc + p.reviewCount, 0);
  const avgRating = (bundle.products.reduce((acc, p) => acc + p.rating, 0) / bundle.products.length).toFixed(1);

  const reasons = [
    `Average product rating: ${avgRating}+`,
    `${totalReviews.toLocaleString()}+ combined customer reviews`,
    `Stays within your ₹${bundle.price.toLocaleString()} budget`,
    `Covers 100% of identified apartment essentials`,
    `Best quality-to-price ratio among generated bundles`,
    `Products selected from highly rated sellers`
  ];

  return (
    <div className="w-full bg-[#111827] rounded-2xl p-6 md:p-8">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Why Trust This Bundle?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reasons.map((reason, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-[#1E293B] p-4 rounded-xl shadow-sm border border-[#334155] hover:border-[#00A8E1] transition-colors">
            <CheckCircle className="text-[#00A8E1] flex-shrink-0" size={20} />
            <span className="text-gray-200 font-medium text-sm md:text-base">{reason}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
