import React from 'react'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const platformStats = [
  { id: 1, title: "Total Users", value: "248", trend: "+12 this week", trendColor: "text-emerald-500", icon: "arrow_upward" },
  { id: 2, title: "Total Nutritionists", value: "8", trend: "Active", trendColor: "text-slate-500", icon: null },
  { id: 3, title: "Meals Logged Today", value: "1,034", trend: "+15% vs yesterday", trendColor: "text-emerald-500", icon: "arrow_upward" },
  { id: 4, title: "AI Scans Today", value: "312", trend: "98% success rate", trendColor: "text-teal-600", icon: "check_circle" }
];

const recentSignups = [
  { id: "u_101", name: "Lina M.", email: "lina@example.com", role: "User", joined: "Today, 10:30 AM", status: "Active" },
  { id: "u_102", name: "Dr. Khaled", email: "khaled@clinic.dz", role: "Nutritionist", joined: "Yesterday", status: "Pending" },
  { id: "u_103", name: "Amine B.", email: "amine@example.com", role: "User", joined: "Apr 1, 2026", status: "Active" },
  { id: "u_104", name: "Sarah K.", email: "sarah@example.com", role: "User", joined: "Mar 30, 2026", status: "Active" },
  { id: "u_105", name: "Dr. Meriem", email: "meriem@health.dz", role: "Nutritionist", joined: "Mar 28, 2026", status: "Active" }
];

const systemHealth = [
  { id: "sh_1", service: "AI Model Endpoint (best.pt)", status: "Online", color: "bg-emerald-500" },
  { id: "sh_2", service: "PostgreSQL Database", status: "Online", color: "bg-emerald-500" },
  { id: "sh_3", service: "Last Database Backup", status: "Apr 3, 2026 03:00 AM", color: "bg-slate-400" }
];

// ── Component ──────────────────────────────────────────────────────────────────
export default function PlatformStats() {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Platform Overview</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Live system metrics and recent activity.</p>
      </div>

      {/* ── Top Section: Stat Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">{stat.title}</span>
            <div>
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{stat.value}</span>
              <div className={`mt-2 flex items-center gap-1 text-sm font-bold ${stat.trendColor}`}>
                {stat.icon && <span className="material-symbols-outlined text-[16px]">{stat.icon}</span>}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom Section: Split Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side (Span 2): Recent Signups Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent Signups</h2>
            <button className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSignups.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-sm">{user.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-500 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">{user.joined}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side (Span 1): System Health */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600 text-[20px]">monitor_heart</span>
            <h2 className="text-lg font-bold text-slate-800">System Health</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <ul className="space-y-5">
              {systemHealth.map((health) => (
                <li key={health.id} className="flex justify-between items-center group">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors">
                    {health.service}
                  </span>
                  <div className="flex items-center gap-2">
                    {health.color === 'bg-emerald-500' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                    {health.color === 'bg-slate-400' && (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                    )}
                    <span className="text-xs font-bold text-slate-500">{health.status}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-slate-100 text-center mt-auto">
              <button className="text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-[16px]">troubleshoot</span>
                Run Diagnostics
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}