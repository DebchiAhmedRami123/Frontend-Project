import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import * as mealApi from '../../api/mealApi';
import Spinner from '../../components/ui/Spinner';

export default function MealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const data = await mealApi.getMealDetails(id);
        setMeal(data);
      } catch (err) {
        console.error("Error fetching meal details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Sidebar>
    );
  }

  if (!meal) {
    return (
      <Sidebar>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Meal Not Found</h2>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="bg-slate-50 min-h-screen p-4 md:p-8 font-body">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back
            </button>
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              ID: {id.slice(0, 8)}...
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Image & Main Stats */}
            <div className="space-y-6">
              <div className="aspect-square rounded-[2rem] overflow-hidden bg-white shadow-2xl shadow-teal-900/10 border-4 border-white relative group">
                {meal.image_url ? (
                  <img src={`http://localhost:5000${meal.image_url}`} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 bg-slate-50">
                    <span className="material-symbols-outlined text-9xl">restaurant</span>
                    <p className="font-bold text-slate-300">No Image Available</p>
                  </div>
                )}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50">
                  <span className="text-xs font-black uppercase tracking-widest text-teal-600">
                    {meal.meal_type}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-white">
                <h1 className="text-3xl font-black text-teal-950 mb-2 capitalize">
                  {meal.name || meal.meal_type}
                </h1>
                <p className="text-slate-400 font-bold flex items-center gap-2 mb-8">
                  <span className="material-symbols-outlined text-teal-500">schedule</span>
                  {new Date(meal.logged_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100/50">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-teal-600 mb-1">Calories</span>
                    <span className="text-2xl font-black text-teal-950">{Math.round(meal.total_calories)}</span>
                    <span className="text-xs font-bold text-teal-900/50 ml-1">kcal</span>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Protein</span>
                    <span className="text-2xl font-black text-emerald-950">{Math.round(meal.total_protein)}</span>
                    <span className="text-xs font-bold text-emerald-900/50 ml-1">g</span>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100/50">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Carbs</span>
                    <span className="text-2xl font-black text-blue-950">{Math.round(meal.total_carbs)}</span>
                    <span className="text-xs font-bold text-blue-900/50 ml-1">g</span>
                  </div>
                  <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100/50">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Fats</span>
                    <span className="text-2xl font-black text-rose-950">{Math.round(meal.total_fats)}</span>
                    <span className="text-xs font-bold text-rose-900/50 ml-1">g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Breakdown */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-teal-900/5 border border-white flex flex-col">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-teal-950">Nutritional Breakdown</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Vision Detection</p>
                </div>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {meal.food_items.length === 0 && (
                  <p className="text-slate-400 italic text-center py-12">No individual food items detected.</p>
                )}
                {meal.food_items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-extrabold text-slate-800">{item.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {item.amount && `${item.amount} ${item.unit || 'g'}`}
                          {item.is_ai_detected && ' • AI Detected'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-teal-700">{Math.round(item.calories)} kcal</span>
                        {item.confidence_score && (
                          <div className="mt-1 flex items-center gap-1 justify-end">
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-400" 
                                style={{ width: `${item.confidence_score * 100}%` }}
                              />
                            </div>
                            <span className="text-[8px] font-black text-teal-400">{Math.round(item.confidence_score * 100)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-slate-100">
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">P: <span className="text-emerald-600">{Math.round(item.protein)}g</span></div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">C: <span className="text-blue-600">{Math.round(item.carbs)}g</span></div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">F: <span className="text-rose-600">{Math.round(item.fats)}g</span></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button 
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all hover:shadow-xl shadow-slate-900/20 active:scale-95"
                >
                  Adjust Breakdown
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Sidebar>
  );
}
