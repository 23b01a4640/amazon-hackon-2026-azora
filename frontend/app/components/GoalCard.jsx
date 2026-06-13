export default function GoalCard({ image, title, onClick }) {
  return (
    <button
      onClick={() => onClick(title)}
      className="flex flex-col items-center justify-center bg-[#1E293B] hover:bg-[#1E293B]/80 rounded-xl border border-transparent hover:border-[#00A8E1] transition-all transform hover:scale-105 cursor-pointer w-full overflow-hidden group"
    >
      <div className="w-full h-32 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 w-full text-center">
        <div className="text-white font-bold text-base">{title}</div>
      </div>
    </button>
  );
}
