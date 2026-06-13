export default function OrderBreakdown({ bundle }) {
  if (!bundle) return null;
  
  const productsTotal = bundle.products.reduce((acc, p) => acc + p.price, 0);
  const optimization = bundle.price - productsTotal; // It might be negative if bundle is cheaper

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 mb-6 w-full max-w-2xl mx-auto shadow-sm">
      <h3 className="text-white text-lg font-bold mb-4 uppercase tracking-wider">Cost Breakdown</h3>
      <div className="flex justify-between text-gray-300 mb-3">
        <span>Products Total</span>
        <span>₹{productsTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-300 mb-4 pb-4 border-b border-[#334155]">
        <span>Bundle Optimization</span>
        <span className={optimization < 0 ? "text-green-400" : "text-gray-300"}>
          {optimization > 0 ? "+" : ""}₹{optimization.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between text-white text-xl font-bold">
        <span>Total</span>
        <span className="text-[#00A8E1]">₹{bundle.price.toLocaleString()}</span>
      </div>
    </div>
  );
}
