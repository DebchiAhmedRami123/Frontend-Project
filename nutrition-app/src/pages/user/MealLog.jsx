import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';


const mockMealHistory = {
  currentDate: "Today, Oct 27",
  dailyTotals: { calories: 1520, protein: 110, carbs: 140, fats: 55 },
  logs: [
    {
      id: "log_3",
      time: "01:30 PM",
      name: "Grilled Chicken & Quinoa",
      calories: 470,
      macros: { protein: "52g", carbs: "46g", fats: "8g" },
      ai_estimated: true,
      image_placeholder: "🥗" 
    },
    {
      id: "log_2",
      time: "10:15 AM",
      name: "Protein Shake & Almonds",
      calories: 320,
      macros: { protein: "35g", carbs: "12g", fats: "16g" },
      ai_estimated: false,
      image_placeholder: "🥤"
    },
    {
      id: "log_1",
      time: "07:30 AM",
      name: "Oatmeal with Blueberries",
      calories: 410,
      macros: { protein: "12g", carbs: "72g", fats: "8g" },
      ai_estimated: true,
      image_placeholder: "🥣"
    }
  ]
};

export default function MealLog() {
  const { currentDate, dailyTotals, logs } = mockMealHistory;
  const navigate = useNavigate();

  return (
    <Sidebar>
      <div className="animate-fade-in font-body">
        <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Button */}
        <div className="mb-2 md:mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        {/* 1. Page Header & Date Filter */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Meal History</h1>
          <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 px-6 py-3.5 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all cursor-pointer text-slate-600 font-bold group">
            <span className="material-symbols-outlined text-teal-600 text-xl group-hover:scale-110 transition-transform">calendar_month</span>
            <span className="tracking-wide">{currentDate}</span>
            <span className="material-symbols-outlined text-slate-400 text-lg group-hover:translate-y-0.5 transition-transform">expand_more</span>
          </button>
        </header>

        {/* 2. Daily Summary Bar (Top Card) */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-white relative overflow-hidden">
          {/* Subtle accent background */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            {/* Calories Total */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Calories</span>
              <span className="text-5xl md:text-6xl font-black text-teal-950 flex items-baseline gap-2">
                {dailyTotals.calories} <span className="text-xl md:text-2xl text-teal-700/60 font-bold tracking-tight">kcal</span>
              </span>
            </div>
            
            {/* Macros Horizontal Spread */}
            <div className="flex gap-8 md:gap-14 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>Protein
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{dailyTotals.protein}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span>Carbs
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{dailyTotals.carbs}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>Fats
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{dailyTotals.fats}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. The Timeline / Log List */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:ml-14 before:w-0.5 before:bg-gradient-to-b before:from-teal-100 before:to-slate-100">
          {logs.map((log) => (
            <div key={log.id} className="relative flex items-center bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 border border-white hover:border-teal-50 group hover:-translate-y-1">
              
              {/* Left: Time & Icon Box */}
              <div className="flex flex-col items-center mr-5 md:mr-8 shrink-0 w-20 md:w-28 relative z-10">
                <span className="text-[11px] md:text-xs font-bold text-slate-400 mb-3 tracking-wide">{log.time}</span>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl md:text-4xl shadow-inner group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  {log.image_placeholder}
                </div>
              </div>

              {/* Middle: Name & Macros */}
              <div className="flex-1 min-w-0 pr-4 py-2">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 truncate">{log.name}</h3>
                  {log.ai_estimated && (
                    <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-teal-200 shadow-sm shadow-teal-900/5">
                      <span className="material-symbols-outlined text-[14px] text-teal-500">auto_awesome</span>
                      AI Scanned
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-green-50/80 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{log.macros.protein} P
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{log.macros.carbs} C
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-orange-50/80 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{log.macros.fats} F
                  </span>
                </div>
              </div>

              {/* Right: Total Calories */}
              <div className="flex flex-col items-end shrink-0 pl-2 pr-4 md:pr-6">
                <span className="text-3xl md:text-4xl font-black text-teal-600 transition-colors group-hover:text-teal-500">{log.calories}</span>
                <span className="text-xs font-bold text-teal-800/40 uppercase tracking-widest mt-0.5">kcal</span>
              </div>
              
            </div>
          ))}
        </div>

      </div>
      </div>
    </Sidebar>
  );
}
