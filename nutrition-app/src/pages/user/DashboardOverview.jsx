import React from 'react';
import { useNavigate } from 'react-router-dom';


const mockDashboardData = {
  user: { name: "Rami", goal: "Lean Muscle & Fat Loss" },
  dailyProgress: {
    calories: { consumed: 1250, target: 2200 },
    macros: {
      protein: { consumed: 95, target: 160 },
      carbs: { consumed: 110, target: 200 },
      fats: { consumed: 45, target: 80 }
    }
  },
  aiRecommendation: {
    title: "Next Meal: Carb-Cycling Target",
    suggestion: "To hit your protein goals while managing carbs, we recommend a grilled chicken and quinoa bowl.",
    macros: { protein: "40g", carbs: "30g", fats: "12g" }
  },
  recentMeals: [
    { id: 1, name: "Protein Oatmeal", time: "08:30 AM", calories: 450 },
    { id: 2, name: "Chicken & Rice", time: "01:15 PM", calories: 600 }
  ]
};

// Circular Progress Component
const CircularProgress = ({ consumed, target }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((consumed / target) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center flex-shrink-0">
      <svg width="180" height="180" className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          className="text-slate-100"
        />
        {/* Progress Circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="currentColor"
          strokeWidth="14"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-teal-600 shadow-teal-500/20 drop-shadow-xl transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-teal-950 tracking-tight">{consumed}</span>
        <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">/ {target} kcal</span>
      </div>
    </div>
  );
};

// Horizontal Progress Bar for Macros
const MacroBar = ({ label, consumed, target, colorClass }) => {
  const percentage = Math.min((consumed / target) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-black text-slate-700">
          {consumed}g <span className="font-semibold text-slate-400 text-xs">/ {target}g</span>
        </span>
      </div>
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const { user, dailyProgress, aiRecommendation, recentMeals } = mockDashboardData;
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 p-4 md:p-8 w-full animate-fade-in font-body overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <header>
          <h1 className="text-4xl font-extrabold tracking-tight text-teal-950">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">
            Current Goal: <span className="text-teal-700 font-bold">{user.goal}</span>
          </p>
        </header>

        {/* 4 Cards Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: The Macro Engine */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-white flex flex-col justify-center relative overflow-hidden">
            <h2 className="text-2xl font-extrabold text-teal-950 mb-8 border-b border-slate-100 pb-4 inline-block w-full">
              Daily Nutrition Engine
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-12 w-full px-4">
              <CircularProgress 
                consumed={dailyProgress.calories.consumed} 
                target={dailyProgress.calories.target} 
              />
              <div className="flex-1 w-full space-y-8">
                <MacroBar 
                  label="Protein" 
                  consumed={dailyProgress.macros.protein.consumed} 
                  target={dailyProgress.macros.protein.target} 
                  colorClass="bg-[#39FF14]" // Electric Green
                />
                <MacroBar 
                  label="Carbs" 
                  consumed={dailyProgress.macros.carbs.consumed} 
                  target={dailyProgress.macros.carbs.target} 
                  colorClass="bg-[#0077BE]" // Ocean Blue
                />
                <MacroBar 
                  label="Fats" 
                  consumed={dailyProgress.macros.fats.consumed} 
                  target={dailyProgress.macros.fats.target} 
                  colorClass="bg-[#FD5E53]" // Sunset Orange
                />
              </div>
            </div>
          </div>

          {/* Card 2: AI Dynamic Recommendation */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-teal-100 flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] text-teal-600">auto_awesome</span>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-teal-600 font-bold">psychology</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">AI Coach</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-teal-950 mb-4">{aiRecommendation.title}</h3>
            <p className="text-teal-900/70 text-sm leading-relaxed mb-8 font-medium">
              {aiRecommendation.suggestion}
            </p>
            
            <div className="mt-auto bg-white/60 backdrop-blur-sm rounded-2xl p-5 flex justify-between items-center border border-white">
              <div className="text-center w-1/3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Protein</span>
                <span className="block text-base font-black text-teal-950">{aiRecommendation.macros.protein}</span>
              </div>
              <div className="w-px h-8 bg-teal-900/10"></div>
              <div className="text-center w-1/3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Carbs</span>
                <span className="block text-base font-black text-teal-950">{aiRecommendation.macros.carbs}</span>
              </div>
              <div className="w-px h-8 bg-teal-900/10"></div>
              <div className="text-center w-1/3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fats</span>
                <span className="block text-base font-black text-teal-950">{aiRecommendation.macros.fats}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Today's Timeline */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-white">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-teal-950">Today's Timeline</h2>
              <button className="text-sm font-bold text-teal-600 hover:text-teal-800 transition-colors uppercase tracking-wider">
                View Diary
              </button>
            </div>
            
            <div className="space-y-4">
              {recentMeals.length === 0 && (
                 <p className="text-slate-400 font-medium text-center py-6">No meals logged yet today.</p>
              )}
              {recentMeals.map((meal) => (
                <div key={meal.id} className="flex items-center p-4 bg-slate-50/70 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group">
                  <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mr-5 flex-shrink-0 group-hover:scale-110 transition-transform">
                    {/* Placeholder image icon */}
                    <span className="material-symbols-outlined text-2xl">restaurant</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-slate-800 text-lg mb-1">{meal.name}</h4>
                    <span className="text-xs font-semibold text-slate-400 tracking-wide">{meal.time}</span>
                  </div>
                  <div className="bg-teal-50/50 px-5 py-2 rounded-full border border-teal-100 backdrop-blur-sm group-hover:bg-teal-100/50 transition-colors">
                    <span className="text-sm font-black text-teal-700">{meal.calories} <span className="opacity-70 text-xs">kcal</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Quick Action CTA */}
          <div 
            onClick={() => navigate('/dashboard/scan')}
            className="bg-teal-600 rounded-3xl p-8 shadow-xl shadow-teal-900/20 text-white flex flex-col items-center justify-center hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full min-h-[250px]"
          >
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-teal-800 rounded-full mix-blend-multiply filter blur-2xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 shadow-lg shadow-teal-900/20 transition-all duration-500 relative ring-4 ring-white/10 group-hover:ring-white/30">
                 <div className="absolute inset-0 rounded-[2rem] bg-white/20 animate-ping opacity-20"></div>
                <span className="material-symbols-outlined text-4xl font-light">center_focus_strong</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-2">Scan New Meal</h2>
              <p className="text-teal-100 text-sm font-medium tracking-wide">AI Vision Engine Ready</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
