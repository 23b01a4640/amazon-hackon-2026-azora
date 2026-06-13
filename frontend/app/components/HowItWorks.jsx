import { Search, ListChecks, ArrowRightLeft, ShoppingBag } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { id: 1, title: "Tell Us Your Goal", icon: <Search size={32} /> },
    { id: 2, title: "Answer A Few Questions", icon: <ListChecks size={32} /> },
    { id: 3, title: "Compare Bundles", icon: <ArrowRightLeft size={32} /> },
    { id: 4, title: "Checkout Instantly", icon: <ShoppingBag size={32} /> },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-24 mb-16 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">How Azora Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-20 h-20 rounded-2xl bg-[#1E293B] border border-[#334155] group-hover:border-[#00A8E1] group-hover:bg-[#1E293B]/80 text-[#00A8E1] flex items-center justify-center mb-6 transition-all transform group-hover:-translate-y-1 shadow-lg">
              {step.icon}
            </div>
            <div className="text-[#00A8E1] font-bold text-sm mb-2 uppercase tracking-wider">Step {index + 1}</div>
            <h3 className="text-white font-semibold text-lg">{step.title}</h3>
          </div>
        ))}
        {/* Decorative connecting line for lg screens */}
        <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-[2px] bg-[#334155] -z-0"></div>
      </div>
    </section>
  );
}
