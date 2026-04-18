import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';


const AI_AVAILABLE = true;

export default function FoodScan() {
  const navigate = useNavigate();
  // States: 'idle', 'processing', 'result'
  const [scanState, setScanState] = useState('idle');
  const [scanData, setScanData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states for manual review/entry
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [imagePath, setImagePath] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  
  // State for adding new items
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', calories: '', protein: '', carbs: '', fats: '' });

  // Handle actual upload
  const handleUploadChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Quick validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert("Only JPG and PNG files are supported.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be under 10MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    setScanState('processing');
    setErrorMsg('');

    try {
      // Import the api 
      const { recognizeFood } = await import('../../api/recognitionApi');
      const data = await recognizeFood(file);
      
      setScanData(data);
      setImagePath(data.image_path);
      
      // Pre-fill form
      setTotalCalories(Math.round(data.summary.total_calories || 0));
      setTotalProtein(Math.round(data.summary.total_protein || 0));
      setTotalCarbs(Math.round(data.summary.total_carbs || 0));
      setTotalFats(Math.round(data.summary.total_fats || 0));
      
      const items = (data.detections || []).map(d => ({
        name: d.name,
        calories: d.calories,
        protein: d.protein,
        carbs: d.carbs,
        fats: d.fats,
        is_ai_detected: true,
        confidence_score: d.confidence
      }));
      setFoodItems(items);
      
      setScanState('result');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to analyze image. Please try again or log manually.');
      setScanState('result'); // Fallback to manual
    }
  };

  const handleCancel = () => {
    setScanState('idle');
    setScanData(null);
    setErrorMsg('');
    setTotalCalories(0);
    setTotalProtein(0);
    setTotalCarbs(0);
    setTotalFats(0);
    setFoodItems([]);
    setImagePath(null);
    setImagePreview(null);
    setIsAddingItem(false);
    setNewItem({ name: '', calories: '', protein: '', carbs: '', fats: '' });
  };

  const handleRemoveItem = (idx) => {
    const itemToRemove = foodItems[idx];
    setFoodItems(prev => prev.filter((_, i) => i !== idx));
    
    setTotalCalories(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.calories || 0))));
    setTotalProtein(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.protein || 0))));
    setTotalCarbs(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.carbs || 0))));
    setTotalFats(prev => Math.max(0, Math.round(Number(prev) - (itemToRemove.fats || 0))));
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    
    const added = {
      name: newItem.name,
      calories: Number(newItem.calories) || 0,
      protein: Number(newItem.protein) || 0,
      carbs: Number(newItem.carbs) || 0,
      fats: Number(newItem.fats) || 0,
      is_ai_detected: false,
      confidence_score: 1
    };

    setFoodItems(prev => [...prev, added]);

    setTotalCalories(prev => Math.round(Number(prev) + added.calories));
    setTotalProtein(prev => Math.round(Number(prev) + added.protein));
    setTotalCarbs(prev => Math.round(Number(prev) + added.carbs));
    setTotalFats(prev => Math.round(Number(prev) + added.fats));

    setNewItem({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    setIsAddingItem(false);
  };

  const handleSaveMeal = async () => {
    try {
      const { logMeal } = await import('../../api/mealApi'); // ensure it's imported
      await logMeal({
        name: 'Detected Meal',
        meal_type: 'lunch', // Default or add a selector later
        total_calories: Number(totalCalories),
        total_protein: Number(totalProtein),
        total_carbs: Number(totalCarbs),
        total_fats: Number(totalFats),
        image_path: imagePath,
        food_items: foodItems
      });
      
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to save meal: " + (err.message || "Unknown error"));
    }
  };

  return (
    <Sidebar>
      <div className="animate-fade-in font-body">
        <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold transition-colors w-fit group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Dashboard
          </button>
        </div>

        {/* 1. Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950 mb-4">AI Food Scanner</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
            Upload a photo of your meal to instantly calculate calories and macros.
          </p>
        </header>

        {/* 2. Upload Zone (Idle State) */}
        {scanState === 'idle' && (
          <label 
            className="w-full bg-teal-50/50 border-4 border-dashed border-teal-300 rounded-[2.5rem] p-16 md:p-24 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-400 hover:scale-[1.01] transition-all duration-300 group shadow-xl shadow-teal-900/5"
          >
            <input 
              type="file" 
              accept="image/jpeg, image/png" 
              className="hidden" 
              onChange={handleUploadChange} 
            />
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
              <span className="material-symbols-outlined text-teal-600 text-5xl">add_a_photo</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-teal-950 mb-3 text-center">Click or drag food image here</h3>
            <p className="text-teal-700/60 font-bold tracking-wide uppercase text-sm">Supports JPG, PNG</p>
          </label>
        )}

        {/* 3. Processing State */}
        {scanState === 'processing' && (
          <div className="w-full h-96 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl shadow-teal-900/5 flex flex-col items-center justify-center space-y-10 animate-pulse">
            <div className="relative flex items-center justify-center hover:scale-105 transition-transform">
              <div className="w-24 h-24 border-8 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
              <span className="material-symbols-outlined absolute text-teal-600 text-4xl">center_focus_strong</span>
            </div>
            <p className="text-2xl font-bold tracking-tight text-teal-950 text-center px-6">Analyzing food instance segmentation...</p>
          </div>
        )}

        {/* 4. Manual Fallback Form (Result State) */}
        {scanState === 'result' && (
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-teal-900/5 border border-white relative overflow-hidden animate-fade-in">
            
            {/* Header & Badge */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-100 pb-6 gap-6">
              <h2 className="text-3xl font-extrabold text-teal-950">Meal Details</h2>
              {errorMsg ? (
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-sm shadow-amber-900/5">
                  <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
                  {errorMsg}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-sm shadow-teal-900/5">
                  <span className="material-symbols-outlined text-teal-500 text-base">verified</span>
                  AI Detection Successful
                </div>
              )}
            </div>

            {/* Scanned Image Display */}
            {imagePreview && (
              <div className="mb-10 w-full rounded-[2rem] overflow-hidden border-4 border-white shadow-xl shadow-teal-900/10 group cursor-default relative">
                <img 
                  src={imagePreview} 
                  alt="Scanned Food" 
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white font-extrabold tracking-wide uppercase text-sm drop-shadow-md">
                    Analyzed Image
                  </span>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-8">
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">local_fire_department</span>
                  Total Calories
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={totalCalories}
                    onChange={(e) => setTotalCalories(e.target.value)}
                    placeholder="450" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-teal-950 placeholder-slate-400 text-lg pr-16" 
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kcal</span>
                </div>
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-3 gap-6 pt-6 flex-1">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-green-700 uppercase tracking-widest text-center">Protein</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={totalProtein}
                      onChange={(e) => setTotalProtein(e.target.value)}
                      placeholder="0" 
                      className="w-full bg-green-50 border border-green-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all font-black text-green-900 text-center text-xl shadow-inner" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-blue-700 uppercase tracking-widest text-center">Carbs</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={totalCarbs}
                      onChange={(e) => setTotalCarbs(e.target.value)}
                      placeholder="0" 
                      className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-blue-900 text-center text-xl shadow-inner" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-orange-700 uppercase tracking-widest text-center">Fats</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={totalFats}
                      onChange={(e) => setTotalFats(e.target.value)}
                      placeholder="0" 
                      className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-black text-orange-900 text-center text-xl shadow-inner" 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
              </div>

              {/* Detected Items List */}
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-extrabold text-teal-950 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 rounded-lg p-1">format_list_bulleted</span>
                    Detected Ingredients
                  </div>
                </h3>
                  
                <div className="grid grid-cols-1 gap-3">
                  {foodItems.length > 0 ? (
                    foodItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-sm border border-slate-100">
                            <span className="material-symbols-outlined text-xl">restaurant</span>
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-base capitalize">{item.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {item.is_ai_detected ? (
                                <>
                                  <span className="material-symbols-outlined text-[12px] text-teal-500">psychology</span>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    {Math.round((item.confidence_score || 0) * 100)}% Match
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-[12px] text-blue-500">person_add</span>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Manually Added
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-bold text-slate-600 text-right">
                          <div className="flex flex-col bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Calories</span>
                            <span className="text-teal-700 text-base font-black">{Math.round(item.calories)}<span className="text-xs font-semibold ml-0.5">kcal</span></span>
                          </div>
                          <div className="hidden sm:flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Protein</span>
                            <span>{Math.round(item.protein)}g</span>
                          </div>
                          <div className="hidden sm:flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Carbs</span>
                            <span>{Math.round(item.carbs)}g</span>
                          </div>
                          <div className="hidden sm:flex flex-col">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Fats</span>
                            <span>{Math.round(item.fats)}g</span>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => handleRemoveItem(idx)}
                            className="ml-2 w-8 h-8 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-100 md:opacity-0 group-hover:opacity-100"
                            title="Remove item"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                      No ingredients added yet.
                    </div>
                  )}

                  {/* Add New Item UI */}
                  {isAddingItem ? (
                    <div className="bg-white border-2 border-dashed border-teal-200 p-5 rounded-2xl mt-2 shadow-sm animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Food</label>
                          <input 
                            type="text" placeholder="e.g. Apple" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold" 
                            value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Calories</label>
                          <input 
                            type="number" placeholder="kcal" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold" 
                            value={newItem.calories} onChange={e => setNewItem({...newItem, calories: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Protein (g)</label>
                          <input 
                            type="number" placeholder="g" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold" 
                            value={newItem.protein} onChange={e => setNewItem({...newItem, protein: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Carbs (g)</label>
                          <input 
                            type="number" placeholder="g" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold" 
                            value={newItem.carbs} onChange={e => setNewItem({...newItem, carbs: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Fats (g)</label>
                          <input 
                            type="number" placeholder="g" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold" 
                            value={newItem.fats} onChange={e => setNewItem({...newItem, fats: e.target.value})} 
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setIsAddingItem(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                          Cancel
                        </button>
                        <button onClick={handleAddItem} className="flex items-center gap-1 px-5 py-2 text-sm font-bold bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-md shadow-teal-900/10 transition-all">
                          <span className="material-symbols-outlined text-[18px]">add</span>
                          Add Item
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAddingItem(true)}
                      className="mt-2 flex items-center justify-center gap-2 w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50/50 transition-all font-bold text-sm"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Add Missing Ingredient
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Actions Area */}
            <div className="mt-12 flex flex-col gap-5">
              <button onClick={handleSaveMeal} className="w-full bg-teal-600 text-white font-black text-xl py-5 rounded-2xl hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/20 hover:-translate-y-1 transition-all duration-300">
                Save & Log Meal
              </button>
              <button 
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors py-2"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                Cancel and upload a different image
              </button>
            </div>
            
          </div>
        )}

      </div>
      </div>
    </Sidebar>
  );
}
