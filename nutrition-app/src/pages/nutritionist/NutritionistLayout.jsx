import React from 'react'
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const mockNutritionistData = {
  name: "Dr. Sarah",
  specialty: "Sports Nutrition",
  clientCount: 12
}

// ── Nav config ─────────────────────────────────────────────────────────────────
const mainLinks = [
  { to: '/nutritionist/clients', icon: 'group', label: 'My Clients' },
  { to: '/nutritionist/consultations', icon: 'calendar_month', label: 'Consultations' },
  { to: '/nutritionist/notes', icon: 'edit_note', label: 'Session Notes' },
  { to: '/nutritionist/profile', icon: 'person', label: 'My Profile' },
]

// ── Material icon helper ───────────────────────────────────────────────────────
function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

// ── Desktop Sidebar ────────────────────────────────────────────────────────────
function DesktopSidebar({ onLogout }) {
  const navigate = useNavigate()

  return (
    <aside className="hidden md:flex fixed top-0 left-0 w-72 h-screen flex-col p-6 bg-slate-50 border-r border-slate-100/50 z-50">
      {/* Brand */}
      <div 
        onClick={() => navigate('/')}
        className="mb-10 cursor-pointer hover:opacity-80 transition-opacity"
        title="Go to Homepage"
      >
        <span className="font-heading text-2xl font-bold tracking-tighter text-emerald-700">CaloAI</span>
        <p className="text-[10px] uppercase tracking-widest text-[#052B34] font-extrabold mt-1">PRO PORTAL</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {mainLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight transition-all duration-150
              ${isActive
                ? 'text-emerald-700 bg-white rounded-full shadow-sm'
                : 'text-slate-500 hover:bg-emerald-50 rounded-xl'}`
            }
          >
            <Icon name={icon} className="text-[20px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-2 border-t border-slate-100 pt-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm w-full"
        >
          <Icon name="logout" className="text-[20px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

// ── Top Header Bar ─────────────────────────────────────────────────────────────
function TopBar() {
  const location = useLocation()
  
  // Resolve page title based on pathname
  let pageTitle = "Pro Portal"
  const currentLink = mainLinks.find(link => location.pathname.includes(link.to))
  if (currentLink) {
    pageTitle = currentLink.label
  }

  return (
    <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-18rem)] z-40 glass-bar border-b border-slate-100/50 justify-between items-center px-10 h-20 bg-white/60 backdrop-blur-md">
      <span className="font-heading font-extrabold text-xl text-emerald-800 tracking-tight">{pageTitle}</span>
      <div className="flex items-center gap-5">
        <div className="relative">
          <input
            className="bg-slate-100 border-none rounded-full px-5 py-2 text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            placeholder="Search clients or notes..."
            type="text"
          />
          <Icon name="search" className="absolute right-3 top-2 text-slate-400 text-[20px]" />
        </div>
        
        <button className="text-slate-400 hover:text-emerald-600 transition-colors relative">
          <Icon name="notifications" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden lg:block">
            <span className="block text-sm font-bold text-slate-700">{mockNutritionistData.name}</span>
            <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{mockNutritionistData.specialty}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
             {mockNutritionistData.name.charAt(4)} {/* 'S' from 'Dr. Sarah' */}
          </div>
        </div>
      </div>
    </header>
  )
}

// ── Mobile Bottom Nav ──────────────────────────────────────────────────────────
function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {mainLinks.map(({ to, icon, label }) => {
          const isActive = location.pathname.includes(to)
          return (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5 min-w-0 px-1">
               <Icon
                name={icon}
                className={`text-[22px] transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              <span className={`text-[10px] font-medium transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {label.split(' ')[0]}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

// ── Main Export: Layout Shell ───────────────────────────────────────────────
export default function NutritionistLayout() {
  const { logout: authLogout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    authLogout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <DesktopSidebar onLogout={handleLogout} />
      <TopBar />
      <MobileBottomNav />

      <main className="md:ml-72 min-h-screen pb-20 md:pb-0 md:pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
          <Outlet /> {/* Renders the specific child dashboard components seamlessly */}
        </div>
      </main>
    </div>
  )
}
