import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import { getDashboardStats } from '../../api/mealApi';

const CircleProgress = ({ label, current, target, unit, color, bg }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const strokeColor = bg.replace('bg-', 'stroke-');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36 flex items-center justify-center mb-5 group cursor-default">
        <svg className="w-full h-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r={radius} 
            className="stroke-slate-100" 
            strokeWidth="8" fill="none" 
          />
          <circle 
            cx="50" cy="50" r={radius} 
            className={`${strokeColor} transition-all duration-[1.5s] ease-out group-hover:brightness-110`} 
            strokeWidth="8" fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
          <span className={`text-2xl font-black ${color}`}>{Math.round(current)}</span>
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{unit}</span>
        </div>
      </div>
      <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest mb-1.5">{label}</h4>
      <p className="text-xs font-bold text-slate-400">Target: {Math.round(target)}</p>
      <div className={`mt-3 text-[10px] font-black px-3 py-1 rounded-full border border-slate-100 bg-slate-50 ${color} shadow-sm`}>
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

export default function Progress() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await getDashboardStats(selectedDate);
        setData(stats);
      } catch (err) {
        console.error('Failed to fetch progress stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  if (!data) return (
    <Sidebar><div className="flex justify-center items-center h-screen"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div></Sidebar>
  );

  const daily = data.dailyProgress;
  const history = data.history || [];
  
  const dailyConsumption = {
    calories: { current: daily.calories.consumed, target: daily.calories.target, unit: 'kcal', color: 'text-teal-500', bg: 'bg-teal-500' },
    protein: { current: daily.macros.protein.consumed, target: daily.macros.protein.target, unit: 'g', color: 'text-emerald-500', bg: 'bg-emerald-500' },
    carbs: { current: daily.macros.carbs.consumed, target: daily.macros.carbs.target, unit: 'g', color: 'text-blue-500', bg: 'bg-blue-500' },
    fats: { current: daily.macros.fats.consumed, target: daily.macros.fats.target, unit: 'g', color: 'text-orange-500', bg: 'bg-orange-500' }
  };

  const avgCalories = history.length > 0 ? history.reduce((sum, d) => sum + d.calories, 0) / history.length : 0;
  const metGoals = history.filter(d => d.met_goal).length;
  const consistencyScore = history.length > 0 ? (metGoals / history.length) * 100 : 0;
  
  const targetCals = daily.calories.target;
  const netDeficit = history.reduce((sum, d) => sum + (targetCals - d.calories), 0);

  const displayDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const weekRangeStart = history.length > 0 ? new Date(history[0].date + 'T12:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '';
  const weekRangeEnd = history.length > 0 ? new Date(history[history.length-1].date + 'T12:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '';

  const maxCal = Math.max(...history.map(d => d.calories), targetCals);

  return (
    <Sidebar>
      <div className="animate-fade-in font-body pb-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="mb-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Dashboard
            </button>
          </div>

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Progress & Tracking</h1>
              <p className="text-slate-500 font-medium mt-3 text-lg">Visualize your daily consumption vs overarching goals.</p>
            </div>
            
            <div className="relative group">
              <input 
                type="date" 
                value={selectedDate}
                onChange={handleDateChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <button className="flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-200 px-7 py-4 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all text-slate-600 font-bold group hover:-translate-y-0.5">
                <span className="material-symbols-outlined text-teal-600 text-[20px] group-hover:scale-110 transition-transform">calendar_month</span>
                <span className="tracking-wide text-[15px]">{displayDate}</span>
                <span className="material-symbols-outlined text-slate-400 text-lg group-hover:translate-y-0.5 transition-transform">expand_more</span>
              </button>
            </div>
          </header>

          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-teal-900/5 border border-white hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500">
            <h2 className="text-2xl font-extrabold text-teal-950 mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-2 rounded-2xl shadow-sm">donut_large</span>
              Macros on {displayDate}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {Object.entries(dailyConsumption).map(([key, macro], idx) => (
                <CircleProgress key={idx} label={key} {...macro} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-white flex flex-col h-full hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500">
              <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
                <h3 className="text-2xl font-extrabold text-teal-950 flex items-center gap-3">
                  <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-1.5 rounded-xl">query_stats</span>
                  7-Day Summary
                </h3>
                <span className="text-[11px] font-extrabold text-slate-500 bg-slate-100 px-4 py-2 rounded-full tracking-widest uppercase">{weekRangeStart} - {weekRangeEnd}</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-10">
                <div className="flex items-center justify-between group">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-teal-600">Avg Daily Intake</span>
                    <span className="text-4xl font-black text-slate-800 tracking-tight">{Math.round(avgCalories)} <span className="text-lg font-bold text-slate-400 tracking-widest uppercase">kcal</span></span>
                  </div>
                  <div className="w-14 h-14 rounded-[1.25rem] bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500 border border-slate-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-2xl">drag_handle</span>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-emerald-600">Net Accumulation/Deficit</span>
                    <span className={`text-4xl font-black tracking-tight ${netDeficit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {netDeficit > 0 ? '-' : '+'}{Math.abs(Math.round(netDeficit))} <span className="text-lg font-bold tracking-widest uppercase">kcal</span>
                    </span>
                  </div>
                  <div className={`w-14 h-14 rounded-[1.25rem] border flex items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-110 ${netDeficit >= 0 ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                    <span className="material-symbols-outlined text-2xl">{netDeficit >= 0 ? 'trending_down' : 'trending_up'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 transition-colors group-hover:text-teal-600">Consistency Score</span>
                    <span className="text-4xl font-black text-teal-600 tracking-tight">{Math.round(consistencyScore)}%</span>
                  </div>
                  <div className="w-14 h-14 rounded-[1.25rem] bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-900/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-teal-500">
                    <span className="material-symbols-outlined text-2xl">star</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 via-white to-teal-50/50 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-teal-900/5 border border-white flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/10">
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <h3 className="text-2xl font-extrabold text-teal-950 mb-2">Weekly Calorie Trend</h3>
                  <p className="text-sm text-slate-500 font-bold">Intake over the selected 7 days</p>
                </div>
                <span className="material-symbols-outlined text-teal-400 text-4xl mt-1 opacity-70">bar_chart_4_bars</span>
              </div>

              <div className="flex-1 flex items-end justify-between gap-3 md:gap-4 mt-auto relative z-10 h-56 border-b-2 border-slate-100 pb-3">
                {history.map((day, i) => {
                  const height = maxCal > 0 ? (day.calories / maxCal) * 100 : 0;
                  const isToday = day.date === selectedDate;
                  
                  return (
                  <div key={i} className="w-full flex flex-col items-center gap-3 group h-full justify-end cursor-pointer relative">
                    <div className="absolute top-0 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-20 pointer-events-none">
                       <span className="text-[11px] font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100 shadow-sm whitespace-nowrap">
                         {Math.round(day.calories)} kcal
                       </span>
                    </div>
                    <div 
                      className={`w-full max-w-[3rem] min-w-[1.5rem] rounded-t-[14px] transition-all duration-500 delay-75 group-hover:opacity-90 ${isToday ? 'bg-gradient-to-t from-teal-500 to-teal-400 shadow-[0_-8px_20px_rgba(20,184,166,0.3)]' : 'bg-teal-200/40 group-hover:bg-teal-300/60'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute bottom-0 translate-y-full mt-2 w-full text-center">
                       <span className={`text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest px-1 md:px-2 py-1 rounded-md ${isToday ? 'text-teal-600 bg-teal-50 border border-teal-100' : 'text-slate-400'}`}>
                         {day.label}
                       </span>
                    </div>
                  </div>
                )})}
              </div>
              <div className="flex justify-between px-2 md:px-3 mt-5 relative z-10 w-full invisible">
                {history.map((h, i) => <span key={i}>LabelSpace</span>)}
              </div>
            </div>

          </div>
        </div>
      </div>
    </Sidebar>
  );
}
