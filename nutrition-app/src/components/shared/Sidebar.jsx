import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

// ── Nav config ─────────────────────────────────────────────────────────────────

const mainLinks = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/scan',      icon: 'restaurant', label: 'Nutrition' },
  { to: '/log',       icon: 'description', label: 'Meal Log' },
  { to: '/progress',  icon: 'insights', label: 'Progress' },
  { to: '/consultations', icon: 'medical_services', label: 'Consults' },
  { to: '/profile',   icon: 'person', label: 'Profile' },
]

const roleLinks = [
  { to: '/nutritionist', icon: 'monitor_heart', label: 'Nutritionist', roles: ['nutritionist', 'admin'] },
  { to: '/admin',        icon: 'admin_panel_settings', label: 'Admin', roles: ['admin'] },
]

const mobileLinks = [
  { to: '/dashboard', icon: 'dashboard', label: 'Home' },
  { to: '/scan',      icon: 'restaurant', label: 'Scan' },
  { to: '/log',       icon: 'description', label: 'Log' },
  { to: '/progress',  icon: 'insights', label: 'Progress' },
  { to: '/profile',   icon: 'person', label: 'Profile' },
]

// ── Material icon helper ───────────────────────────────────────────────────────

function Icon({ name, className = '' }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

// ── Desktop Sidebar ────────────────────────────────────────────────────────────

function DesktopSidebar({ role, onLogout }) {
  const navigate = useNavigate()
  const visibleRoleLinks = roleLinks.filter(l => l.roles.includes(role))

  return (
    <aside className="hidden md:flex fixed top-0 left-0 w-72 h-screen flex-col p-6 bg-slate-50 border-r border-slate-100/50 z-50">
      {/* Brand */}
      <div className="mb-10">
        <span className="font-heading text-2xl font-bold tracking-tighter text-emerald-700">NutriTrack</span>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">AI Nutrition</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {mainLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
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

        {visibleRoleLinks.length > 0 && (
          <>
            <div className="h-px bg-slate-100 my-3" />
            {visibleRoleLinks.map(({ to, icon, label }) => (
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
          </>
        )}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-2 border-t border-slate-100 pt-6">
        <button
          onClick={() => navigate('/scan')}
          className="w-full vitality-gradient text-white rounded-full py-3 px-4 font-bold text-sm mb-4 flex items-center justify-center gap-2 soft-glow hover:shadow-lg transition-shadow"
        >
          <Icon name="add" className="text-[18px]" />
          Log Meal
        </button>
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

function TopBar({ onLogMeal }) {
  return (
    <header className="hidden md:flex fixed top-0 right-0 w-[calc(100%-18rem)] z-40 glass-bar border-b border-slate-100/50 justify-between items-center px-10 h-20">
      <span className="font-heading font-extrabold text-xl text-emerald-800">NutriTrack Editorial</span>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            className="bg-slate-100 border-none rounded-full px-5 py-2 text-sm w-64 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            placeholder="Search insights..."
            type="text"
          />
          <Icon name="search" className="absolute right-3 top-2 text-slate-400 text-[20px]" />
        </div>
        <button className="text-slate-500 hover:text-emerald-600 transition-colors">
          <Icon name="notifications" />
        </button>
        <button
          onClick={onLogMeal}
          className="vitality-gradient text-white px-6 py-2 rounded-full text-sm font-bold soft-glow"
        >
          Log Meal
        </button>
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
          R
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
        {mobileLinks.map(({ to, icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <NavLink key={to} to={to} className="flex flex-col items-center gap-0.5 min-w-0 px-1">
              <Icon
                name={icon}
                className={`text-[22px] transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
              />
              <span className={`text-[10px] font-medium transition ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

// ── Main Export: Sidebar Layout ─────────────────────────────────────────────

export default function Sidebar({ children }) {
  const { user, role, logout: authLogout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    authLogout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <DesktopSidebar role={role || 'client'} onLogout={handleLogout} />
      <TopBar onLogMeal={() => navigate('/scan')} />
      <MobileBottomNav />

      <main className="md:ml-72 min-h-screen pb-20 md:pb-0 md:pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
