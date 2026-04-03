import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';

const mockRecommendations = {
  nutritionistStatus: {
    assigned: true,
    name: "Dr. Sarah",
    reviewState: "Pending Weekly Review" 
  },
  status: {

    timeOfDay: "Evening",
    strategy: "Carb Tapering & Muscle Repair",
    insight: "You've hit 90% of your daily carb allowance but are trailing on protein. Let's focus on a lean, high-protein dinner to maximize muscle retention."
  },
  suggestedMeals: [
    {
      id: "rec_1",
      type: "Dinner",
      name: "Herb-Crusted Salmon with Asparagus",
      calories: 420,
      macros: { protein: "45g", carbs: "8g", fats: "22g" },
      matchScore: "98%"
    },
    {
      id: "rec_2",
      type: "Dinner",
      name: "Grilled Chicken & Zucchini Noodles",
      calories: 380,
      macros: { protein: "50g", carbs: "12g", fats: "14g" },
      matchScore: "94%"
    }
  ],
  userPreferences: {
    favoriteProteins: ["Chicken", "Salmon", "Eggs"],
    favoriteVeggies: ["Broccoli", "Spinach", "Asparagus"],
    excluded: ["Dairy", "Pork"]
  }
};

const Chip = ({ label, type }) => {
  const getStyle = () => {
    switch(type) {
      case 'include': return "bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100";
      case 'exclude': return "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100";
      default: return "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${getStyle()}`}>
      {label}
      <span className="material-symbols-outlined text-[14px] opacity-50 hover:opacity-100">close</span>
    </span>
  );
}

export default function Recommendations() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <div className="animate-fade-in font-body pb-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Back Button */}
          <div className="mb-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Dashboard
            </button>
          </div>

          {/* 1. Page Header & Strategy Alert */}
          <header className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-2">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Dietary Recommendations</h1>
                <p className="text-slate-500 font-medium mt-3 text-lg">Your adaptive recommendations based on today's biometrics.</p>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-50 border border-teal-100 text-teal-700 rounded-full font-bold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                System Active
              </div>
            </div>

            {/* The Insight Banner */}
            <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-blue-800 rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-teal-900/20 text-white relative overflow-hidden group hover:shadow-teal-900/30 transition-shadow duration-500">
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-2xl group-hover:bg-white/20 transition-all duration-[2s]"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-sm border border-white/20">
                  <span className="material-symbols-outlined text-4xl text-teal-300">lightbulb</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold mb-2 text-white flex items-center gap-2 uppercase tracking-wide">
                    {mockRecommendations.status.timeOfDay} Strategy: {mockRecommendations.status.strategy}
                  </h3>
                  <p className="text-teal-50/90 font-medium text-lg leading-relaxed">
                    "{mockRecommendations.status.insight}"
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Human-in-the-loop Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">clinical_notes</span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-teal-950 mb-1">Coach Connection</h3>
                  <p className="text-sm font-bold text-slate-500">
                    {mockRecommendations.nutritionistStatus.assigned ? `Assigned to ${mockRecommendations.nutritionistStatus.name}` : "Pending Assignment"} 
                    <span className="mx-2 text-slate-300">|</span> 
                    <span className="text-teal-600 tracking-wide uppercase text-[11px]">{mockRecommendations.nutritionistStatus.reviewState}</span>
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap w-full md:w-auto px-8 py-3.5 rounded-full border-2 border-teal-600 text-teal-700 font-bold hover:bg-teal-50 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group">
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">send</span>
                Request Nutritionist Review
              </button>
            </div>
          </div>

          {/* 2. The Smart Suggestions */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
              <h2 className="text-2xl font-extrabold text-teal-950 flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-2 rounded-2xl shadow-sm">restaurant_menu</span>
                Curated Suggestions
              </h2>
              <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-5 py-2.5 rounded-full font-bold hover:bg-white hover:shadow-md transition-all group">
                <span className="material-symbols-outlined text-[18px] group-hover:-rotate-180 transition-transform duration-700">refresh</span>
                Regenerate Ideas
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {mockRecommendations.suggestedMeals.map((meal, idx) => (
                <div key={meal.id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-100 hover:bg-white transition-all duration-300 relative overflow-hidden group cursor-pointer">
                  
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-1.5 rounded-bl-2xl rounded-tr-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-teal-500/30 group-hover:scale-105 origin-top-right transition-transform">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      Match: {meal.matchScore}
                    </div>
                  )}
                  {idx !== 0 && (
                     <div className="absolute top-6 right-6 text-slate-400 font-black text-xs uppercase tracking-widest">
                       Match: {meal.matchScore}
                     </div>
                  )}

                  <div className="mb-6 pr-24">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{meal.type}</span>
                    <h3 className="text-xl md:text-2xl font-extrabold text-teal-950 leading-tight group-hover:text-teal-700 transition-colors">{meal.name}</h3>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
                    <div className="flex gap-2.5">
                      <span className="inline-flex items-center gap-1.5 bg-green-50/80 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{meal.macros.protein} P
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{meal.macros.carbs} C
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-orange-50/80 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{meal.macros.fats} F
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-800">
                      {meal.calories} <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">kcal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Taste Profile / Dietary Prefs */}
          <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-xl font-extrabold text-teal-950 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">tune</span>
                Taste Profile Config
              </h2>
              <button className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors">
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add Preference
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Proteins</span>
                <div className="flex flex-wrap gap-2">
                  {mockRecommendations.userPreferences.favoriteProteins.map((item, i) => (
                    <Chip key={i} label={item} type="include" />
                  ))}
                </div>
              </div>
              
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preferred Veggies</span>
                <div className="flex flex-wrap gap-2">
                  {mockRecommendations.userPreferences.favoriteVeggies.map((item, i) => (
                    <Chip key={i} label={item} type="include" />
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-rose-400 uppercase tracking-widest mb-3">Excluded Ingredients</span>
                <div className="flex flex-wrap gap-2">
                  {mockRecommendations.userPreferences.excluded.map((item, i) => (
                    <Chip key={i} label={item} type="exclude" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Sidebar>
  );
}
