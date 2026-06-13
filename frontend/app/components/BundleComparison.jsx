export default function BundleComparison() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16 px-4">
      <div className="overflow-x-auto rounded-2xl border border-[#334155] bg-[#111827]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#334155] bg-[#1E293B]">
              <th className="p-4 text-gray-400 font-semibold uppercase tracking-wider text-sm">Feature</th>
              <th className="p-4 text-white font-bold text-center">Essentials</th>
              <th className="p-4 text-[#FF9900] font-bold text-center">Best Value</th>
              <th className="p-4 text-white font-bold text-center">Premium</th>
            </tr>
          </thead>
          <tbody className="text-sm md:text-base">
            <tr className="border-b border-[#334155] hover:bg-[#1E293B]/50 transition-colors">
              <td className="p-4 text-gray-300 font-medium">Cost</td>
              <td className="p-4 text-gray-400 text-center">Low</td>
              <td className="p-4 text-white text-center">Medium</td>
              <td className="p-4 text-gray-400 text-center">High</td>
            </tr>
            <tr className="border-b border-[#334155] hover:bg-[#1E293B]/50 transition-colors">
              <td className="p-4 text-gray-300 font-medium">Quality</td>
              <td className="p-4 text-gray-400 text-center">Medium</td>
              <td className="p-4 text-white text-center">High</td>
              <td className="p-4 text-[#00A8E1] font-bold text-center">Highest</td>
            </tr>
            <tr className="hover:bg-[#1E293B]/50 transition-colors">
              <td className="p-4 text-gray-300 font-medium">Value</td>
              <td className="p-4 text-gray-400 text-center">Good</td>
              <td className="p-4 text-[#FF9900] font-bold text-center">Best</td>
              <td className="p-4 text-gray-400 text-center">Premium</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
