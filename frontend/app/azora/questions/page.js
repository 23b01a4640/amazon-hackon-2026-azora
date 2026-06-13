"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getQuestions, getAdaptiveQuestions } from "../../services/api";
import ProgressIndicator from "../../components/ProgressIndicator";
import QuestionCard from "../../components/QuestionCard";
import OptionCard from "../../components/OptionCard";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Home, Search } from "lucide-react";

function QuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mission = searchParams.get("mission");
  const mode = searchParams.get("mode");
  const query = searchParams.get("query");

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAnswer, setCustomAnswer] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let data;
        if (mode === "adaptive" && query) {
          data = await getAdaptiveQuestions(query);
        } else if (mission) {
          data = await getQuestions(mission);
        } else {
          router.push("/azora");
          return;
        }

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          if (mode === "adaptive") {
            router.push(`/azora/bundles?mode=search&query=${encodeURIComponent(query)}`);
          } else {
            router.push(`/azora/bundles?mission=${encodeURIComponent(mission)}`);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        alert("Failed to load questions. Please try again.");
        router.push("/azora");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [mission, mode, query, router]);

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="⏳ Loading questions..." />;
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = answers[currentQuestionIndex] !== undefined;

  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
    setCustomAnswer("");
  };

  const handleCustomAnswer = () => {
    if (customAnswer.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: customAnswer.trim(),
      }));
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      if (mode === "adaptive") {
        router.push(`/azora/bundles?mode=search&query=${encodeURIComponent(query)}`);
      } else {
        router.push(`/azora/bundles?mission=${encodeURIComponent(mission)}`);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCustomAnswer("");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setCustomAnswer("");
    }
  };

  const getOptionsForQuestion = (questionText) => {
    const q = questionText.toLowerCase();
    if (q.includes("budget")) return ["₹2000", "₹5000", "₹10000", "₹15000+"];
    if (q.includes("how many people")) return ["1", "2", "3+"];
    if (q.includes("beginner or experienced")) return ["Beginner", "Experienced"];
    if (q.includes("indoors or outdoors")) return ["Indoors", "Outdoors", "Both"];
    if (q.includes("insulated or regular")) return ["Insulated", "Regular"];
    if (q.includes("skin type")) return ["Oily", "Dry", "Combination", "Sensitive"];
    if (q.includes("basic or complete")) return ["Basic", "Complete"];
    if (q.includes("hostel")) return ["Yes", "No"];
    if (q.includes("laptop")) return ["Yes", "No"];
    if (q.includes("furniture")) return ["Yes", "No"];
    if (q.includes("cookware")) return ["Yes", "No"];
    if (q.includes("cooking for")) return ["Myself", "Family"];
    if (q.includes("screen size")) return ["24 inch", "27 inch", "32 inch+"];
    if (q.includes("office work or gaming")) return ["Office Work", "Gaming", "Both"];
    return null;
  };

  const options = getOptionsForQuestion(currentQuestion);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-72px)] bg-[#0F172A]">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col flex-1">
        
        <div className="text-center mb-10">
          <h1 className="text-xl md:text-2xl font-bold text-[#00A8E1] mb-2 flex items-center justify-center gap-2">
            {mode === "adaptive" ? (
              <>
                <Search className="text-[#00A8E1]" size={28} /> {query}
              </>
            ) : (
              <>
                <Home className="text-[#00A8E1]" size={28} /> {mission}
              </>
            )}
          </h1>
          <p className="text-gray-400">Let&apos;s personalize your shopping plan.</p>
        </div>

        <ProgressIndicator 
          currentStep={currentQuestionIndex + 1} 
          totalSteps={totalQuestions} 
        />

        <div className="flex-1 flex flex-col justify-center">
          <QuestionCard questionText={currentQuestion}>
            {options ? (
              options.map((option) => (
                <OptionCard
                  key={option}
                  text={option}
                  isSelected={answers[currentQuestionIndex] === option}
                  onClick={() => handleSelectOption(option)}
                />
              ))
            ) : (
              <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
                <input
                  type="text"
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  onBlur={handleCustomAnswer}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomAnswer()}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-[#1E293B] border border-[#334155] rounded-xl text-white placeholder:text-gray-500 focus:border-[#00A8E1] outline-none"
                />
                {customAnswer.trim() && (
                  <button
                    onClick={handleCustomAnswer}
                    className="px-4 py-2 bg-[#00A8E1] text-white rounded-xl font-medium self-end"
                  >
                    Confirm
                  </button>
                )}
              </div>
            )}
          </QuestionCard>
        </div>

        <div className="w-full max-w-2xl mx-auto flex justify-between mt-auto pt-8 pb-4 px-4 sm:px-0">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${
              currentQuestionIndex === 0
                ? "text-gray-600 cursor-not-allowed opacity-0 invisible"
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

export default function QuestionsPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} message="⏳ Loading..." />}>
      <QuestionsContent />
    </Suspense>
  );
}
