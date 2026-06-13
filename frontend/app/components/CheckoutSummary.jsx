import { Home } from "lucide-react";

export default function CheckoutSummary({ bundle }) {
  if (!bundle) return null;
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-[#1E293B] border border-[#334155] rounded-2xl mb-8 w-full max-w-2xl mx-auto shadow-sm">
      <h2 className="text-[#00A8E1] text-lg md:text-xl font-bold flex items-center gap-2 mb-4">
        <Home size={24} /> New Apartment Setup
      </h2>
      <h3 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-wider mb-2">{bundle.name} Bundle</h3>
      <p className="text-gray-400 mb-6 text-sm md:text-base">{bundle.products.length} Products Included</p>
      <div className="text-4xl font-extrabold text-[#00A8E1]">Total: ₹{bundle.price.toLocaleString()}</div>
    </div>
  );
}
