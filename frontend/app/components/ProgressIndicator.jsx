export default function ProgressIndicator({ currentStep, totalSteps }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="flex justify-between text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">
        <span>Question {currentStep} of {totalSteps}</span>
        <span className="text-[#00A8E1]">{percentage}%</span>
      </div>
      <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-[#00A8E1] transition-all duration-500 ease-out rounded-full relative"
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle glow effect on the progress bar */}
          <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-sm" />
        </div>
      </div>
    </div>
  );
}
