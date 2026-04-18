import React, { useState } from 'react';
import { updateMeal, deleteMeal } from '../../api/mealApi';

export default function MealDetailsModal({ meal, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editable states
  const [name, setName] = useState(meal.name || '');
  const [calories, setCalories] = useState(Math.round(meal.total_calories || 0));
  const [protein, setProtein] = useState(Math.round(meal.total_protein || 0));
  const [carbs, setCarbs] = useState(Math.round(meal.total_carbs || 0));
  const [fats, setFats] = useState(Math.round(meal.total_fats || 0));
  const [foodItems, setFoodItems] = useState(meal.food_items || []);

  const handleRemoveItem = (idx) => {
    const itemToRemove = foodItems[idx];
    setFoodItems(prev => prev.filter((_, i) => i !== idx));
    setCalories(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.calories || 0))));
    setProtein(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.protein || 0))));
    setCarbs(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.carbs || 0))));
    setFats(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.fats || 0))));
  };

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await updateMeal(meal.id, {
        name,
        total_calories: Number(calories),
        total_protein: Number(protein),
        total_carbs: Number(carbs),
        total_fats: Number(fats),
        food_items: foodItems
      });
      onUpdate();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update meal');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this meal?")) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await deleteMeal(meal.id);
      onUpdate();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete meal');
      setLoading(false);
    }
  };

  // Base URL for Images
  const baseImgUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000');
  const imageUrl = meal.image_url ? `${baseImgUrl}${meal.image_url}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-teal-900/40 relative font-body flex flex-col">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        <div className="p-8 md:p-10 flex-1">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {errorMsg}
            </div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">restaurant</span>
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-teal-950 capitalize">{meal.name}</h2>
                  <p className="text-slate-400 font-bold text-sm tracking-wide">
                    {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {imageUrl && (
                <div className="w-full rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md">
                  <img src={imageUrl} alt="Meal" className="w-full h-64 object-cover" />
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Calories</span>
                  <span className="text-xl font-black text-teal-700">{Math.round(meal.total_calories)}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Protein</span>
                  <span className="text-xl font-black text-green-700">{Math.round(meal.total_protein)}g</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Carbs</span>
                  <span className="text-xl font-black text-blue-700">{Math.round(meal.total_carbs)}g</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                  <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Fats</span>
                  <span className="text-xl font-black text-orange-700">{Math.round(meal.total_fats)}g</span>
                </div>
              </div>

              {meal.food_items && meal.food_items.length > 0 && (
                <div className="pt-4">
                  <h3 className="text-lg font-extrabold text-teal-950 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-600 bg-teal-50 rounded-lg p-1">category</span>
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {meal.food_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div>
                          <p className="font-extrabold text-slate-800 capitalize">{item.name}</p>
                          {item.is_ai_detected && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="material-symbols-outlined text-[12px] text-teal-500">psychology</span>
                              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                                {Math.round((item.confidence_score || 0) * 100)}% Match
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right flex gap-3 text-sm font-bold text-slate-500">
                          <span className="text-teal-700 bg-teal-50 px-2 py-1 rounded-md">{Math.round(item.calories)} kcal</span>
                          <span className="bg-slate-50 px-2 py-1 rounded-md">{Math.round(item.protein)}g P</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 py-4 rounded-2xl font-extrabold transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Details
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded-2xl font-extrabold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  {loading ? 'Deleting...' : 'Delete Meal'}
                </button>
              </div>

            </div>
          ) : (
            /* EDIT MODE */
            <div className="space-y-6">
              <h2 className="text-2xl font-extrabold text-teal-950 mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 font-bold">edit_square</span> 
                Edit Meal
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Meal Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Calories</label>
                    <input type="number" value={calories} onChange={e => setCalories(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Protein(g)</label>
                    <input type="number" value={protein} onChange={e => setProtein(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Carbs(g)</label>
                    <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Fats(g)</label>
                    <input type="number" value={fats} onChange={e => setFats(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none" />
                  </div>
                </div>
              </div>

              {foodItems.length > 0 && (
                <div className="pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block">Manage Ingredients</span>
                  <div className="space-y-2">
                    {foodItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl">
                        <span className="font-bold text-sm tracking-wide capitalize">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400">{Math.round(item.calories)} kcal</span>
                          <button onClick={() => handleRemoveItem(idx)} className="w-8 h-8 rounded-lg bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-[0.5] flex items-center justify-center font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 bg-teal-600 text-white hover:bg-teal-700 py-4 rounded-2xl font-extrabold transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}