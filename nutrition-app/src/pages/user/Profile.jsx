import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/shared/Sidebar';
import axiosInstance from '../../api/axiosInstance';
import useAuth from '../../hooks/useAuth';

const initialProfileData = {
  personal: {
    name: "Rami",
    email: "rami@example.com",
    age: 21,
    gender: "Male",
    height: 182, // cm
    weight: 75, // kg
    activityLevel: "Active (Daily Exercise)"
  },
  preferences: {
    dietType: "Carb Cycling / Intermittent Fasting",
    allergies: "None",
    theme: 'Light',
    language: 'English',
    notifications: true
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
  const { user, logout, updateToken } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    ...initialProfileData,
    personal: {
      ...initialProfileData.personal,
      name: user?.name || initialProfileData.personal.name,
      email: user?.email || initialProfileData.personal.email,
      weight: user?.weight || initialProfileData.personal.weight,
    },
    goals: {
      ...initialProfileData.goals,
      primaryGoal: user?.goal || initialProfileData.goals.primaryGoal
    }
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handlePersonalChange = (e) => {
    setProfile({
      ...profile,
      personal: { ...profile.personal, [e.target.name]: e.target.value }
    });
  };

  const handlePreferencesChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfile({
      ...profile,
      preferences: { ...profile.preferences, [e.target.name]: value }
    });
  };

  const handleGoalsChange = (e) => {
    setProfile({
      ...profile,
      goals: { ...profile.goals, [e.target.name]: e.target.value }
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    setStatus({ type: '', message: '' });
    setLoading(true);
    try {
      // Parallel requests for all sections updated
      const profilePromise = axiosInstance.put('/auth/update-profile', {
        name: profile.personal.name,
        email: profile.personal.email,
        ...(passwordForm.newPassword && passwordForm)
      });
      
      const goalsPromise = axiosInstance.put('/auth/update-goals', {
        currentWeight: profile.personal.weight,
        goal: profile.goals.primaryGoal
      });
      
      // Simulate waiting for multiple endpoints
      const [profileRes, goalsRes] = await Promise.all([profilePromise, goalsPromise]);
      
      if (profileRes.data.token) updateToken(profileRes.data.token);
      
      setStatus({ type: 'success', message: 'All changes saved & calories recalculated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save changes.' });
    }
    setLoading(false);
  };

  const handleExportData = async () => {
    try {
      const response = await axiosInstance.get('/auth/export-data', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'nutrition_data_export.json');
      document.body.appendChild(link);
      link.click();
      setStatus({ type: 'success', message: 'Data exported successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to export data.' });
    }
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm('Delete all logged meals and history? This cannot be undone.')) return;
    try {
      await axiosInstance.delete('/auth/delete-history');
      setStatus({ type: 'success', message: 'Meal history cleared.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to clear history.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Permanently delete your account and all data?')) return;
    try {
      await axiosInstance.delete('/auth/delete-account');
      await logout();
      navigate('/login');
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete account.' });
    }
  };

  return (
    <Sidebar>
      <div className="animate-fade-in font-body">
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-teal-950">Profile & Settings</h1>
            <p className="text-slate-500 font-medium mt-3 text-lg">Manage your biological data, fine-tune the algorithm, and adjust settings.</p>
          </div>
          <button 
             onClick={handleSaveChanges} 
             disabled={loading}
             className="bg-teal-600 text-white font-extrabold px-8 py-4 rounded-full shadow-lg shadow-teal-900/20 hover:bg-teal-700 hover:shadow-teal-900/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">save</span>}
            Save Interventions
          </button>
        </header>

        {status.message && (
          <div className={`p-4 rounded-xl font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <span className="material-symbols-outlined">{status.type === 'success' ? 'check_circle' : 'error'}</span>
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Card A: Personal Metrics */}
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-white transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/10 hover:border-teal-50">
              <h2 className="text-2xl font-extrabold text-teal-950 mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-600 border border-teal-100 bg-teal-50 p-2 rounded-2xl shadow-sm">person</span>
                Personal Data
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8 border-b border-slate-100 pb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                  <input type="text" name="name" value={profile.personal.name} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                  <input type="email" name="email" value={profile.personal.email} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Current Password (to change)</label>
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">New Password</label>
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-teal-950 mb-6">Biological Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input type="number" name="age" value={profile.personal.age} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Height (cm)</label>
                  <input type="number" name="height" value={profile.personal.height} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Current Weight (kg)</label>
                  <input type="number" name="weight" value={profile.personal.weight} onChange={handlePersonalChange} className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-bold text-teal-950 transition-all" />
                </div>
                <div className="flex flex-col gap-2 relative">
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
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pl-1">Primary Goal Target</label>
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

            {/* Card C: App Preferences & Danger Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-teal-900/5 border border-white">
                 <h2 className="text-xl font-extrabold text-teal-950 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-teal-600 bg-teal-50 p-2 rounded-2xl">settings</span>
                  Preferences
                </h2>
                <div className="space-y-5">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-sm text-teal-950">App Theme</span>
                    <select name="theme" value={profile.preferences.theme} onChange={handlePreferencesChange} className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-sm font-bold text-teal-900 outline-none">
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-sm text-teal-950">Language</span>
                    <select name="language" value={profile.preferences.language} onChange={handlePreferencesChange} className="bg-white border border-slate-200 rounded-xl px-3 py-1 text-sm font-bold text-teal-900 outline-none">
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                  <label className="flex items-center justify-between cursor-pointer bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="font-bold text-sm text-teal-950">Push Notifications</span>
                    <div className="relative">
                      <input type="checkbox" name="notifications" checked={profile.preferences.notifications} onChange={handlePreferencesChange} className="sr-only" />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${profile.preferences.notifications ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${profile.preferences.notifications ? 'translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-red-50/50 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-red-100">
                 <h2 className="text-xl font-extrabold text-red-700 mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-600 bg-red-100 p-2 rounded-2xl">warning</span>
                  Data Control
                </h2>
                <div className="space-y-4">
                  <button onClick={handleExportData} className="w-full flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl font-bold text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-400">download</span> Export JSON</span>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </button>
                  <button onClick={handleDeleteHistory} className="w-full flex items-center justify-between bg-white border border-red-200 p-4 rounded-2xl font-bold text-sm text-red-600 hover:bg-red-100 transition-colors">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined text-red-400">delete_sweep</span> Delete History</span>
                    <span className="material-symbols-outlined text-red-400">chevron_right</span>
                  </button>
                  <button onClick={handleDeleteAccount} className="w-full flex items-center justify-between bg-red-600 border border-transparent p-4 rounded-2xl font-bold text-sm text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    <span className="flex items-center gap-2"><span className="material-symbols-outlined">person_off</span> Delete Account</span>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
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
                  These targets dynamically adjust your daily recommendations and algorithms.
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
