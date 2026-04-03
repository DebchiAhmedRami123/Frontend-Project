import React from 'react'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const dashboardStats = {
  activeClients: 24,
  pendingConsultations: 3,
  actionNeeded: 2
};

const mockClients = [
  {
    id: "cli_001",
    name: "Rami M.",
    avatar: "R",
    goal: "Fat Loss & Muscle Retention",
    adherence: "92%",
    status: "On Track", 
    lastLog: "2 hours ago",
    nextConsult: "Oct 30, 10:00 AM"
  },
  {
    id: "cli_002",
    name: "Alex J.",
    avatar: "A",
    goal: "Maintain Weight",
    adherence: "65%",
    status: "Needs Review",
    lastLog: "Yesterday",
    nextConsult: "Unscheduled"
  },
  {
    id: "cli_003",
    name: "Sofia T.",
    avatar: "S",
    goal: "Muscle Gain",
    adherence: "88%",
    status: "On Track",
    lastLog: "5 hours ago",
    nextConsult: "Nov 2, 2:00 PM"
  }
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function NutritionistDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Top Section: Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Clients */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Active Clients</span>
           <span className="text-5xl font-black text-slate-800">{dashboardStats.activeClients}</span>
        </div>
        
        {/* Pending Consultations */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Pending Consultations</span>
           <span className="text-5xl font-black text-slate-800">{dashboardStats.pendingConsultations}</span>
        </div>
        
        {/* Action Needed */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10">
             <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 mb-2">
               Action Needed
               <span className="material-symbols-outlined text-[16px] animate-pulse">error</span>
             </span>
             <span className="text-5xl font-black text-red-500">{dashboardStats.actionNeeded}</span>
           </div>
        </div>
      </div>

      {/* 2. Main Section: Client Overview Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
           <div>
             <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Client Overview</h2>
             <p className="text-sm font-medium text-slate-400 mt-1">Manage and track your active rosters</p>
           </div>
           
           <button className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-5 py-2.5 rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2">
             <span className="material-symbols-outlined text-[18px]">filter_list</span>
             Filter
           </button>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {mockClients.map(client => (
            <div key={client.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors group cursor-default">
               
               {/* Left: Avatar & Info */}
               <div className="flex items-center gap-5 md:w-[30%]">
                 <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-teal-700 font-black text-xl shadow-inner border border-slate-200/60 transition-transform group-hover:scale-105">
                   {client.avatar}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-800 tracking-tight">{client.name}</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1 truncate max-w-[200px]">{client.goal}</p>
                 </div>
               </div>

               {/* Middle-Left: Adherence */}
               <div className="md:w-[25%] flex flex-col justify-center">
                 <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1.5">AI Adherence</span>
                 <div className="flex items-center gap-3">
                   <span className="text-lg font-black text-slate-700 w-12">{client.adherence}</span>
                   <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                     <div 
                        className={`h-full rounded-full transition-all duration-1000 ${parseInt(client.adherence) > 80 ? 'bg-teal-500' : 'bg-orange-400'}`} 
                        style={{ width: client.adherence }}
                     />
                   </div>
                 </div>
               </div>

               {/* Middle-Right: Status Badge */}
               <div className="md:w-[20%] flex items-center">
                 <span className={`px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 ${
                   client.status === 'On Track' 
                     ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                     : 'bg-orange-50 text-orange-700 border border-orange-200/50'
                 }`}>
                   {client.status === 'On Track' ? (
                     <span className="material-symbols-outlined text-[14px]">check_circle</span>
                   ) : (
                     <span className="material-symbols-outlined text-[14px]">warning</span>
                   )}
                   {client.status}
                 </span>
               </div>

               {/* Right Action: Button */}
               <div className="md:w-[25%] flex justify-end">
                 <button className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-6 py-3 rounded-xl transition-all flex items-center gap-2">
                   Review Logs
                   <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                 </button>
               </div>
               
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}