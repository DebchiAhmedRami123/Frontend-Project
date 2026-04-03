import React, { useState } from 'react'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const initialProfile = {
  name: "Dr. Sarah Amrani",
  email: "sarah@nutritrack.dz",
  specialty: "Sports Nutrition",
  bio: "Passionate about helping athletes and high-performers optimize their diet for peak performance and recovery. Certified in advanced sports dietetics.",
  experience: 5
};

const profileStats = {
  totalClients: 12,
  sessionsCompleted: 34,
  notesWritten: 67,
  memberSince: "January 2026",
  rating: 4 // out of 5
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function NutritionistProfile() {
  const [formData, setFormData] = useState(initialProfile)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    // Simulate save logic if connected to backend later
    alert("Profile updated successfully!");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage your professional information and track your impact</p>
      </div>

      {/* ── Two-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: Editable Form (Span 2) ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
          </div>

          <div className="p-8 space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 cursor-not-allowed"
                  title="Email cannot be changed"
                />
              </div>

              {/* Specialty */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialty</label>
                <input 
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Years of Experience</label>
                <input 
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / About</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Write a brief professional summary..."
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: The Impact Card (Span 1) ── */}
        <div className="lg:col-span-1 bg-[#052B34] text-white rounded-3xl shadow-lg flex flex-col relative overflow-hidden group">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none transition-transform group-hover:scale-125"></div>

          <div className="px-8 py-8 border-b border-teal-800/50 relative z-10">
            <h2 className="text-xl font-extrabold flex items-center gap-3 tracking-tight">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                <span className="material-symbols-outlined text-teal-300 text-[18px]">insights</span>
              </div>
              Your Impact
            </h2>
          </div>

          <div className="p-8 space-y-0 flex-1 relative z-10 flex flex-col">
            
            {/* Stats List */}
            <ul className="flex-1">
              <li className="flex justify-between items-center py-5 border-b border-teal-800/50">
                <span className="text-sm font-bold text-teal-100 uppercase tracking-widest">Total Clients</span>
                <span className="text-2xl font-black text-white">{profileStats.totalClients}</span>
              </li>
              <li className="flex justify-between items-center py-5 border-b border-teal-800/50">
                <span className="text-sm font-bold text-teal-100 uppercase tracking-widest">Sessions</span>
                <span className="text-2xl font-black text-white">{profileStats.sessionsCompleted}</span>
              </li>
              <li className="flex justify-between items-center py-5 border-b border-teal-800/50">
                <span className="text-sm font-bold text-teal-100 uppercase tracking-widest">Notes</span>
                <span className="text-2xl font-black text-white">{profileStats.notesWritten}</span>
              </li>
              <li className="flex justify-between items-center py-5">
                <span className="text-sm font-bold text-teal-100 uppercase tracking-widest">Member Since</span>
                <span className="text-base font-bold text-white">{profileStats.memberSince}</span>
              </li>
            </ul>

            {/* Rating */}
            <div className="mt-8 pt-6 border-t border-teal-800/50 text-center">
              <span className="text-xs font-bold text-teal-100 uppercase tracking-widest block mb-3">Current Rating</span>
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={`text-2xl ${star <= profileStats.rating ? 'text-amber-400 drop-shadow-md' : 'text-teal-800/60'}`}
                  >
                    {star <= profileStats.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}