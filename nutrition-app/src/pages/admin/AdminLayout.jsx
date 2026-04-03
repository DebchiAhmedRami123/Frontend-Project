import React from 'react'
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Platform Stats', path: '/admin/stats', icon: 'query_stats' },
    { name: 'Users', path: '/admin/users', icon: 'group' },
    { name: 'Nutritionists', path: '/admin/nutritionists', icon: 'medical_information' },
    { name: 'Assign Control', path: '/admin/assign', icon: 'link' }
  ]

  const getPageTitle = () => {
    if (location.pathname.includes('users')) return "Users Directory"
    if (location.pathname.includes('nutritionists')) return "Nutritionists Review"
    if (location.pathname.includes('assign')) return "Alliance & Assignment"
    return "Platform Statistics"
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-body">
      
      {/* ── Sidebar (Fixed Left) ── */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm relative">
        
        {/* Brand Area */}
        <div className="p-8">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
            <span className="font-headline text-3xl font-extrabold tracking-tighter text-teal-700">NutriTrack</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">Admin</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200
                ${isActive 
                  ? 'bg-teal-50 text-teal-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }
              `}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Area: Logout */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">logout</span>
            Exit System
          </button>
        </div>
      </aside>

      {/* ── Main Content Wrapper (Right Side) ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-40 shrink-0">
          
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-teal-600 rounded-full hidden md:block"></div>
             <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4 cursor-pointer hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-slate-100">
             <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-md">
               SA
             </div>
             <div className="hidden sm:block">
               <p className="text-sm font-bold text-slate-800 leading-tight">System Admin</p>
               <p className="text-[10px] font-bold text-red-500 tracking-widest uppercase">Root Access</p>
             </div>
          </div>

        </header>

        {/* The Outlet Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50 relative">
          {/* Subtle watermark or pattern for admin view can go here if needed */}
          <div className="max-w-7xl mx-auto animate-fade-in">
             <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}
