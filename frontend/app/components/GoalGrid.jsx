import { goals } from "../data/mockData";
import GoalCard from "./GoalCard";

export default function GoalGrid({ onSelectGoal }) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <h3 className="text-xl font-bold text-white mb-6 px-4">Suggested Goals</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            icon={goal.icon}
            title={goal.title}
            onClick={onSelectGoal}
          />
        ))}
      </div>
    </div>
  );
}
