import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const links = [
  { to: '/nutritionist', icon: '📊', label: 'Dashboard' },
  { to: '/nutritionist/consultations', icon: '🗓️', label: 'My Consultations' },
  { to: '/nutritionist/upload', icon: '📥', label: 'Upload Plan' },
  { to: '/nutritionist/progress', icon: '📈', label: 'Monitor Progress' },
  { to: '/nutritionist/profile', icon: '👤', label: 'My Profile' },
  { to: '/nutritionist/blog/new', icon: '✍️', label: 'Write Blog Post' },
]

export default function NutritionistSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center gap-2 px-5 mb-8">
        <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="10" fill="#052B34"/>
          <path d="M18 8C18 8 10 13 10 19.5C10 24.1 13.6 27 18 27C22.4 27 26 24.1 26 19.5C26 13 18 8 18 8Z" fill="white" opacity="0.9"/>
          <path d="M18 14C18 14 14 17 14 20.5C14 22.9 15.8 24.5 18 24.5C20.2 24.5 22 22.9 22 20.5C22 17 18 14 18 14Z" fill="#50CD95"/>
        </svg>
        <span className="font-semibold text-[#052B34] text-sm">NutriTrack</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/nutritionist'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition
              ${isActive
                ? 'bg-[#052B34] text-white font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#052B34]'}`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-4">
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 transition w-full"
        >
          <span className="text-base">🚪</span>
          Logout
        </button>
      </div>
    </div>
  )
}