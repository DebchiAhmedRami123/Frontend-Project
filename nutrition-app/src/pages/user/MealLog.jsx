import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import { getDashboardStats, getTodayMeals } from '../../api/mealApi';
import MealDetailsModal from '../../components/modals/MealDetailsModal';

export default function MealLog() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [dailyTotals, setDailyTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [logs, setLogs] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [stats, meals] = await Promise.all([
        getDashboardStats(selectedDate),
        getTodayMeals(selectedDate)
      ]);
      
      setDailyTotals({
        calories: stats.dailyProgress.calories.consumed,
        protein: stats.dailyProgress.macros.protein.consumed,
        carbs: stats.dailyProgress.macros.carbs.consumed,
        fats: stats.dailyProgress.macros.fats.consumed,
      });

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const formattedMeals = meals.map(m => {
        const d = new Date(m.logged_at);
        return {
          ...m,
          time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          image_placeholder: m.image_url ? (
            <img src={API_URL + m.image_url} alt="Meal" className="w-full h-full object-cover rounded-3xl" />
          ) : "🍽️",
          ai_estimated: !!m.image_url
        };
      });
      setLogs(formattedMeals);
    } catch (err) {
      console.error("Failed to load meal logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const handleMealUpdated = () => {
    fetchDashboard();
  };

  return (
    <Sidebar>
      <div className="animate-fade-in font-body">
        <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="mb-2 md:mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Meal History</h1>
          <div className="relative group">
            <input 
              type="date" 
              value={selectedDate}
              onChange={handleDateChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 px-6 py-3.5 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-slate-600 font-bold w-full sm:w-auto">
              <span className="material-symbols-outlined text-teal-600 text-xl group-hover:scale-110 transition-transform">calendar_month</span>
              <span className="tracking-wide">
                {new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="material-symbols-outlined text-slate-400 text-lg group-hover:translate-y-0.5 transition-transform">expand_more</span>
            </button>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Calories</span>
              <span className="text-5xl md:text-6xl font-black text-teal-950 flex items-baseline gap-2">
                {Math.round(dailyTotals.calories)} <span className="text-xl md:text-2xl text-teal-700/60 font-bold tracking-tight">kcal</span>
              </span>
            </div>
            
            <div className="flex gap-8 md:gap-14 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>Protein
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{Math.round(dailyTotals.protein)}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span>Carbs
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{Math.round(dailyTotals.carbs)}g</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></span>Fats
                </span>
                <span className="text-3xl font-extrabold text-slate-800">{Math.round(dailyTotals.fats)}g</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:ml-14 before:w-0.5 before:bg-gradient-to-b before:from-teal-100 before:to-slate-100">
          {loading ? (
             <div className="text-center py-10">Loading logs...</div>
          ) : logs.length === 0 ? (
             <div className="text-center py-10 text-slate-500 font-medium bg-white/50 rounded-3xl p-6">No meals logged for this date.</div>
          ) : logs.map((log) => (
            <div 
              key={log.id} 
              onClick={() => setSelectedMeal(log)}
              className="relative flex items-center bg-white/60 backdrop-blur-md rounded-[2.5rem] p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 border border-white hover:border-teal-50 group hover:-translate-y-1 cursor-pointer">
              
              <div className="flex flex-col items-center mr-5 md:mr-8 shrink-0 w-20 md:w-28 relative z-10">
                <span className="text-[11px] md:text-xs font-bold text-slate-400 mb-3 tracking-wide">{log.time}</span>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl md:text-4xl shadow-inner group-hover:bg-white group-hover:scale-110 transition-all duration-300 overflow-hidden">
                  {log.image_placeholder}
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-4 py-2">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 truncate capitalize">{log.name}</h3>
                  {log.ai_estimated && (
                    <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-teal-200 shadow-sm shadow-teal-900/5">
                      <span className="material-symbols-outlined text-[14px] text-teal-500">auto_awesome</span>
                      AI Scanned
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-green-50/80 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{Math.round(log.total_protein)} P
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{Math.round(log.total_carbs)} C
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-orange-50/80 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{Math.round(log.total_fats)} F
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2 pr-4 md:pr-6">
                <span className="text-3xl md:text-4xl font-black text-teal-600 transition-colors group-hover:text-teal-500">{Math.round(log.total_calories)}</span>
                <span className="text-xs font-bold text-teal-800/40 uppercase tracking-widest mt-0.5">kcal</span>
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
      
      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
          onUpdated={handleMealUpdated}
          onDeleted={handleMealUpdated}
        />
      )}
    </Sidebar>
  );
}
