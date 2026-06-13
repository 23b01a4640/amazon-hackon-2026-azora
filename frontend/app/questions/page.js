"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apartmentQuestions } from "../data/mockQuestions";
import ProgressIndicator from "../components/ProgressIndicator";
import QuestionCard from "../components/QuestionCard";
import OptionCard from "../components/OptionCard";
import LoadingOverlay from "../components/LoadingOverlay";
import { Home } from "lucide-react";

export default function QuestionsPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = apartmentQuestions[currentQuestionIndex];
  const totalQuestions = apartmentQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;

  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      // Mock processing delay to show the loading overlay as requested
      setTimeout(() => {
        router.push("/bundles");
      }, 2500);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A]">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col flex-1">
        
        {/* Goal Summary */}
        <div className="text-center mb-10">
          <h1 className="text-xl md:text-2xl font-bold text-[#00A8E1] mb-2 flex items-center justify-center gap-2">
            <Home className="text-[#00A8E1]" size={28} /> New Apartment Setup
          </h1>
          <p className="text-gray-400">Let's personalize your shopping plan.</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator 
          currentStep={currentQuestionIndex + 1} 
          totalSteps={totalQuestions} 
        />

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center">
          <QuestionCard questionText={currentQuestion.question}>
            {currentQuestion.options.map((option) => (
              <OptionCard
                key={option}
                text={option}
                isSelected={answers[currentQuestion.id] === option}
                onClick={() => handleSelectOption(option)}
              />
            ))}
          </QuestionCard>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full max-w-2xl mx-auto flex justify-between mt-auto pt-8 pb-4 px-4 sm:px-0">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${
              currentQuestionIndex === 0
                ? "text-gray-600 cursor-not-allowed opacity-0 invisible" // visually hidden on first page but keeps flex spacing
                : "text-white bg-[#1E293B] hover:bg-[#334155] border border-[#334155]"
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              !hasAnsweredCurrent
                ? "bg-[#1E293B] text-gray-500 cursor-not-allowed opacity-50 border border-[#334155]"
                : "bg-[#00A8E1] hover:bg-[#0089B8] text-white shadow-[0_0_15px_rgba(0,168,225,0.4)]"
            }`}
          >
            {isLastQuestion ? "Generate My Bundle" : "Next"}
          </button>
        </div>

      </div>

      <LoadingOverlay 
        isLoading={isSubmitting} 
        message="⏳ Building your shopping plan..." 
      />
    </div>
  );
}
