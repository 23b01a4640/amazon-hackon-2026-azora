"use client";

import { useState } from "react";
import HeroSection from "../components/HeroSection";
import SearchBox from "../components/SearchBox";
import RecentSearches from "../components/RecentSearches";
import GoalGrid from "../components/GoalGrid";
import HowItWorks from "../components/HowItWorks";

export default function AzoraHome() {
  const [goalText, setGoalText] = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)] w-full pb-12 pt-8">
      <HeroSection />
      
      <SearchBox 
        value={goalText} 
        onChange={setGoalText} 
      />

      <RecentSearches />
      
      <GoalGrid 
        onSelectGoal={(title) => setGoalText(title)} 
      />
      
      <HowItWorks />
    </div>
  );
}
