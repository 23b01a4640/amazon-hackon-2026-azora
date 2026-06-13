export default function QuestionCard({ questionText, children }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-[#1E293B] rounded-2xl shadow-2xl p-6 sm:p-10 border border-[#334155] mb-8">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8 text-center leading-snug">
        {questionText}
      </h2>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
