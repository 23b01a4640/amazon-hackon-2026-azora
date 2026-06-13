import GoalCard from "./GoalCard";

const goals = [
  {
    id: 1,
    title: "New Apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Start Running",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "College Starter",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Home Office",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Skincare",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&auto=format&fit=crop",
  },
];

export default function GoalGrid({ onSelectGoal }) {
  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <h3 className="text-xl font-bold text-white mb-6 px-4">Suggested Goals</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            image={goal.image}
            title={goal.title}
            onClick={onSelectGoal}
          />
        ))}
      </div>
    </div>
  );
}
