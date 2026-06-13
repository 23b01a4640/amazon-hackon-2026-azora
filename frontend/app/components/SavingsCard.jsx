export default function SavingsCard({ bundle }) {
  if (!bundle) return null;

  const productsTotal = bundle.products.reduce((acc, p) => acc + p.price, 0);
  const savings = productsTotal - bundle.price;

  if (savings <= 0) return null;

  return (
    <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-5 mb-12 w-full max-w-2xl mx-auto flex items-center justify-between shadow-sm">
      <div className="flex flex-col">
        <p className="text-gray-400 text-xs md:text-sm mb-1 uppercase tracking-wider font-medium">Buying Separately</p>
        <p className="text-gray-500 line-through text-sm md:text-base">₹{productsTotal.toLocaleString()}</p>
      </div>
      <div className="bg-green-500/20 px-4 py-2 md:py-3 rounded-lg text-center border border-green-500/30">
        <p className="text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">You Save</p>
        <p className="text-green-400 text-xl md:text-2xl font-extrabold tracking-tight">₹{savings.toLocaleString()}</p>
      </div>
    </div>
  );
}
