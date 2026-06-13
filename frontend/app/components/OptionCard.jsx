export default function OptionCard({ text, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 sm:p-5 rounded-xl text-lg font-semibold transition-all duration-300 transform cursor-pointer border ${
        isSelected 
          ? "bg-[#1E293B] border-[#00A8E1] text-white shadow-[0_0_15px_rgba(0,168,225,0.4)] scale-[1.02]" 
          : "bg-[#111827] border-[#334155] text-gray-300 hover:border-gray-400 hover:bg-[#1E293B]"
      }`}
    >
      {text}
    </button>
  );
}
