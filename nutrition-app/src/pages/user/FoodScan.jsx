import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';


const AI_AVAILABLE = false;

export default function FoodScan() {
  const navigate = useNavigate();
  // States: 'idle', 'processing', 'result'
  const [scanState, setScanState] = useState('idle');

  // Handle fake upload
  const handleUploadClick = () => {
    setScanState('processing');
    setTimeout(() => {
      // If AI_AVAILABLE is false, we bypass straight to the manual fallback form.
      setScanState('result');
    }, 1500);
  };

  const handleCancel = () => {
    setScanState('idle');
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
          <div 
            onClick={handleUploadClick}
            className="w-full bg-teal-50/50 border-4 border-dashed border-teal-300 rounded-[2.5rem] p-16 md:p-24 flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 hover:border-teal-400 hover:scale-[1.01] transition-all duration-300 group shadow-xl shadow-teal-900/5 group"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
              <span className="material-symbols-outlined text-teal-600 text-5xl">add_a_photo</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-teal-950 mb-3 text-center">Click or drag food image here</h3>
            <p className="text-teal-700/60 font-bold tracking-wide uppercase text-sm">Supports JPG, PNG</p>
          </div>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-100 pb-8 gap-6">
              <h2 className="text-3xl font-extrabold text-teal-950">Manual Entry Mode</h2>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-sm shadow-amber-900/5">
                <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
                AI endpoint disconnected. Please log manually.
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-teal-600">restaurant_menu</span>
                    Meal Name
                  </label>
                  <input type="text" placeholder="e.g., Grilled Chicken Salad" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-teal-950 placeholder-slate-400 text-lg" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-teal-600">scale</span>
                    Portion Size
                  </label>
                  <div className="relative">
                    <input type="number" placeholder="250" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-teal-950 placeholder-slate-400 text-lg pr-12" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">g</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-teal-600">local_fire_department</span>
                  Total Calories
                </label>
                <div className="relative">
                  <input type="number" placeholder="450" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold text-teal-950 placeholder-slate-400 text-lg pr-16" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">kcal</span>
                </div>
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-green-700 uppercase tracking-widest text-center">Protein</label>
                  <div className="relative">
                    <input type="number" placeholder="0" className="w-full bg-green-50 border border-green-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all font-black text-green-900 text-center text-xl shadow-inner" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-blue-700 uppercase tracking-widest text-center">Carbs</label>
                  <div className="relative">
                    <input type="number" placeholder="0" className="w-full bg-blue-50 border border-blue-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-blue-900 text-center text-xl shadow-inner" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-extrabold text-orange-700 uppercase tracking-widest text-center">Fats</label>
                  <div className="relative">
                    <input type="number" placeholder="0" className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-black text-orange-900 text-center text-xl shadow-inner" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600/50 font-bold text-sm">g</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions Area */}
            <div className="mt-12 flex flex-col gap-5">
              <button className="w-full bg-teal-600 text-white font-black text-xl py-5 rounded-2xl hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/20 hover:-translate-y-1 transition-all duration-300">
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
