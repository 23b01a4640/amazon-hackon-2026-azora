import { ShoppingCart } from "lucide-react";

export default function CheckoutCTA({ bundle, onProceed }) {
  if (!bundle) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111827] border-t border-[#334155] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex flex-col">
          <span className="text-white font-bold text-sm uppercase tracking-wider">{bundle.name} Bundle</span>
          <div className="text-2xl font-extrabold text-[#00A8E1]">₹{bundle.price.toLocaleString()}</div>
        </div>
        <div className="flex flex-col items-center w-full sm:w-auto">
          <button
            onClick={onProceed}
            className="w-full px-8 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-[#111827] font-bold rounded-xl text-lg transition-colors shadow-[0_4px_14px_0_rgba(255,153,0,0.39)] flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Add Bundle to Amazon Cart
          </button>
          <span className="text-xs text-gray-400 mt-2">One click adds all recommended products.</span>
        </div>
      </div>
    </div>
  );
}
