import * as Icons from "lucide-react";

export default function GoalCard({ icon, title, onClick }) {
  const LucideIcon = Icons[icon] || Icons.HelpCircle;

  return (
    <button
      onClick={() => onClick(title)}
      className="flex flex-col items-center justify-center p-6 bg-[#1E293B] hover:bg-[#1E293B]/80 rounded-xl border border-transparent hover:border-[#00A8E1] transition-all transform hover:scale-105 cursor-pointer gap-4 w-full"
    >
      <div className="mb-2 text-[#00A8E1]">
        <LucideIcon size={40} />
      </div>
      <div className="text-white font-bold text-lg">{title}</div>
    </button>
  );
}
