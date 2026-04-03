import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';


const initialProfileData = {
  personal: {
    name: "Rami",
    age: 21,
    gender: "Male",
    height: 182, // cm
    weight: 75, // kg
    activityLevel: "Active (Daily Exercise)"
  },
  preferences: {
    dietType: "Carb Cycling / Intermittent Fasting",
    allergies: "None"
  },
  goals: {
    primaryGoal: "Fat Loss & Muscle Retention",
    targetWeight: 70 // kg
  },
  dailyRequirements: {
    calories: 2200,
    protein: 160, // g
    carbs: 200, // g
    fats: 84 // g
  }
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfileData);
  const navigate = useNavigate();

  const handlePersonalChange = (e) => {
    setProfile({
      ...profile,
      personal: { ...profile.personal, [e.target.name]: e.target.value }
    });
  };

  const handlePreferencesChange = (e) => {
    setProfile({
      ...profile,
      preferences: { ...profile.preferences, [e.target.name]: e.target.value }
    });
  };

  const handleGoalsChange = (e) => {
    setProfile({
      ...profile,
      goals: { ...profile.goals, [e.target.name]: e.target.value }
    });
  };

  return (
    <Sidebar>
      <div className="animate-fade-in font-body">
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

        {/* 1. Page Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Profile & Health Goals</h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage your biological data and fine-tune your algorithm.</p>
          </div>
          <button className="bg-teal-600 text-white font-extrabold px-8 py-4 rounded-full shadow-lg shadow-teal-900/20 hover:bg-teal-700 hover:shadow-teal-900/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">save</span>
            Save Changes
          </button>
        </header>

        {/* Two-Column Grid Mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card A: Personal Metrics */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-white transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/10 hover:border-teal-50">
              <h2 className="text-2xl font-extrabold text-teal-950 mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-2 rounded-2xl shadow-sm">person</span>
                Personal Metrics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" name="name" value={profile.personal.name} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input type="number" name="age" value={profile.personal.age} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Height (cm)</label>
                  <input type="number" name="height" value={profile.personal.height} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Weight (kg)</label>
                  <input type="number" name="weight" value={profile.personal.weight} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2 relative">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                  <select name="gender" value={profile.personal.gender} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all cursor-pointer appearance-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 bottom-4 text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2 relative">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Activity Level</label>
                  <select name="activityLevel" value={profile.personal.activityLevel} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all cursor-pointer appearance-none">
                    <option value="Sedentary (Little to no exercise)">Sedentary (Little to no exercise)</option>
                    <option value="Lightly Active (Light exercise 1-3 days/week)">Lightly Active (1-3 days/week)</option>
                    <option value="Active (Daily Exercise)">Active (Daily Exercise)</option>
                    <option value="Very Active (Hard exercise 6-7 days/week)">Very Active (6-7 days/week)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 bottom-4 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* Card B: Diet & Goals */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-white transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/10 hover:border-teal-50">
              <h2 className="text-2xl font-extrabold text-teal-950 mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-2 rounded-2xl shadow-sm">track_changes</span>
                Diet & Goals
              </h2>
              
              <div className="grid grid-cols-1 gap-7">
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Primary Goal</label>
                  <select name="primaryGoal" value={profile.goals.primaryGoal} onChange={handleGoalsChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all cursor-pointer appearance-none text-lg">
                    <option value="Lose Weight">Lose Weight</option>
                    <option value="Maintain">Maintain</option>
                    <option value="Build Muscle">Build Muscle</option>
                    <option value="Fat Loss & Muscle Retention">Fat Loss & Muscle Retention</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-5 bottom-[1.125rem] text-slate-400 pointer-events-none">expand_more</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Target Weight (kg)</label>
                    <input type="number" name="targetWeight" value={profile.goals.targetWeight} onChange={handleGoalsChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Allergies</label>
                    <input type="text" name="allergies" value={profile.preferences.allergies} onChange={handlePreferencesChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Dietary Preferences / Protocol</label>
                  <input type="text" name="dietType" value={profile.preferences.dietType} onChange={handlePreferencesChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (The Engine) */}
          <div className="lg:col-span-1 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 rounded-[2.5rem] p-8 shadow-2xl shadow-teal-900/30 text-white relative overflow-hidden h-full flex flex-col min-h-[500px]">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[10rem] text-teal-100">local_fire_department</span>
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-10">
                <h3 className="text-3xl font-extrabold tracking-tight mb-2 text-white">Your Daily Targets</h3>
                <p className="text-teal-100/80 text-sm font-medium leading-relaxed">Calculated automatically based on your biological metrics.</p>
              </div>

              <div className="mb-12">
                <span className="block text-teal-200/80 text-xs font-extrabold tracking-widest uppercase mb-3">Total Energy Base</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-7xl font-black text-white">{profile.dailyRequirements.calories}</span>
                  <span className="text-xl font-bold text-teal-300">kcal<span className="text-teal-400/80">/day</span></span>
                </div>
              </div>

              <div className="space-y-4 mb-10 border-t border-teal-500/50 pt-8">
                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)] bg-green-400"></span>
                    <span className="font-extrabold text-teal-50 tracking-widest uppercase text-sm">Protein</span>
                  </div>
                  <span className="font-black text-2xl tracking-tight">{profile.dailyRequirements.protein}g</span>
                </div>

                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] bg-blue-400"></span>
                    <span className="font-extrabold text-teal-50 tracking-widest uppercase text-sm">Carbs</span>
                  </div>
                  <span className="font-black text-2xl tracking-tight">{profile.dailyRequirements.carbs}g</span>
                </div>

                <div className="flex items-center justify-between bg-white/10 rounded-2xl p-5 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-3.5 h-3.5 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)] bg-orange-400"></span>
                    <span className="font-extrabold text-teal-50 tracking-widest uppercase text-sm">Fats</span>
                  </div>
                  <span className="font-black text-2xl tracking-tight">{profile.dailyRequirements.fats}g</span>
                </div>
              </div>

              <div className="mt-auto pt-6 flex items-start gap-4 p-5 bg-teal-950/40 rounded-2xl border border-teal-800/60 backdrop-blur-md">
                <span className="material-symbols-outlined text-teal-400 text-2xl mt-0.5">auto_awesome</span>
                <p className="text-sm text-teal-100/90 font-medium leading-relaxed">
                  These targets will dynamically adjust your daily recommendations and algorithm charts.
                </p>
              </div>
              </div>
          </div>
        </div>
      </div>
      </div>
    </Sidebar>
  );
}