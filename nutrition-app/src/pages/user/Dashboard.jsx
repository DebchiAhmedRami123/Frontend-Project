import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import useAuth from '../../hooks/useAuth'
import { getGreeting, formatDate } from '../../utils/dateHelpers'
import { mockDailyStats, mockProfile } from '../../utils/mockData'
import { calcMacroTargets } from '../../utils/macroCalc'

const targets = calcMacroTargets(mockDailyStats.cal_goal)
const allMealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

// ── Vitality Ring SVG ──────────────────────────────────────────────────────────

function VitalityRing({ current, goal }) {
  const radius = 110
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(current / goal, 1)
  const offset = circumference - percent * circumference
  const remaining = goal - current

  return (
    <div className="relative w-64 h-64 flex items-center justify-center flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
        <circle cx="128" cy="128" r={radius} fill="transparent"
          stroke="#eceef0" strokeWidth="14" />
        <circle cx="128" cy="128" r={radius} fill="transparent"
          stroke="url(#vitalityGrad)" strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
        <defs>
          <linearGradient id="vitalityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006c49" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-5xl font-extrabold text-[var(--color-text)] tracking-tighter leading-none">
          {remaining.toLocaleString()}
        </span>
        <span className="text-sm font-semibold text-[var(--color-muted)] mt-1">kcal left</span>
      </div>
    </div>
  )
}

// ── Macro Progress Bar ─────────────────────────────────────────────────────────

function MacroBar({ label, current, goal, unit = 'g', color, dotColor }) {
  const percent = Math.min((current / goal) * 100, 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-sm">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dotColor }} />
          {label}
        </span>
        <span className="text-[var(--color-muted)] text-sm font-bold">{current}{unit} / {goal}{unit}</span>
      </div>
      <div className="h-3 w-full bg-[var(--color-surface-container)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ── Meal Image Card ────────────────────────────────────────────────────────────

function MealImageCard({ meal }) {
  const totalCal = meal.items.reduce((s, i) => s + i.calories, 0)
  const totalProtein = meal.items.reduce((s, i) => s + i.protein, 0)
  const time = new Date(meal.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const foodNames = meal.items.map(i => i.name).join(' & ')

  // Placeholder food images
  const mealImages = {
    breakfast: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    dinner: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    snack: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden soft-glow hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
      <div className="h-40 overflow-hidden">
        <img
          src={mealImages[meal.meal_type]}
          alt={foodNames}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">{meal.meal_type}</span>
          <span className="text-slate-400 text-xs">{time}</span>
        </div>
        <h4 className="font-bold text-[var(--color-text)] text-sm">{foodNames}</h4>
        <p className="text-xs text-[var(--color-muted)] mt-1">{totalCal} kcal • {Math.round(totalProtein)}g Protein</p>
      </div>
    </div>
  )
}

// ── Empty Meal Card ────────────────────────────────────────────────────────────

function EmptyMealCard({ type, onAdd }) {
  const labels = { dinner: 'Ready to log your dinner?', snack: 'Track your small bites', breakfast: 'Start your day right', lunch: 'Log your midday meal' }
  return (
    <div
      onClick={onAdd}
      className="border-2 border-dashed border-slate-200/80 rounded-2xl h-[264px] flex flex-col items-center justify-center p-6 text-center group hover:border-emerald-400/50 transition-colors cursor-pointer"
    >
      <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center mb-4 text-[var(--color-muted)] group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <span className="material-symbols-outlined">add</span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1 capitalize">{type}</span>
      <p className="text-sm text-[var(--color-muted)] font-medium">{labels[type] || 'Log this meal'}</p>
      <span className="mt-4 text-xs font-bold text-emerald-600 px-4 py-2 rounded-full border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        Add Meal
      </span>
    </div>
  )
}

// ── Quick Action Card ──────────────────────────────────────────────────────────

function QuickAction({ icon, title, desc, color, bgColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[var(--color-surface-low)] p-8 rounded-2xl flex items-start gap-6 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300 text-left w-full"
    >
      <div className={`w-14 h-14 rounded-full ${bgColor} flex items-center justify-center ${color} group-hover:scale-110 transition-transform flex-shrink-0`}>
        <span className="material-symbols-outlined text-[28px]">{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
        <p className="text-sm text-[var(--color-muted)] mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const firstName = user?.first_name || mockProfile.full_name || 'User'
  const today = formatDate(new Date())
  const percentReached = Math.round(mockDailyStats.percent_reached)

  const loggedMeals = mockDailyStats.meals
  const missingMeals = allMealTypes.filter(t => !loggedMeals.find(m => m.meal_type === t))

  return (
    <Sidebar>
      <div className="space-y-12 animate-fade-in">

        {/* ═══════════════════════  HEADER  ══════════════════════════════ */}
        <section className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-[var(--color-muted)] font-medium">
              {today} — You're {percentReached}% toward your daily goal.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-24 h-1 bg-emerald-200 rounded-full mb-2" />
            <div className="w-16 h-1 bg-emerald-100 rounded-full ml-auto" />
          </div>
        </section>

        {/* ═══════════════════  VITALITY RING + MACROS  ═════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Macro Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 soft-glow flex flex-col md:flex-row items-center gap-12">
            <VitalityRing
              current={mockDailyStats.total_calories}
              goal={mockDailyStats.cal_goal}
            />
            <div className="flex-1 w-full space-y-6">
              <MacroBar label="Protein" current={mockDailyStats.total_protein} goal={targets.protein_g}
                color="#2170e4" dotColor="#2170e4" />
              <MacroBar label="Carbs" current={mockDailyStats.total_carbs} goal={targets.carbs_g}
                color="#e29100" dotColor="#e29100" />
              <MacroBar label="Fats" current={mockDailyStats.total_fat} goal={targets.fat_g}
                color="#ffdad6" dotColor="#ba1a1a" />
            </div>
          </div>

          {/* Hydration Card */}
          <div className="bg-[#2170e4] text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-4xl">water_drop</span>
              <h3 className="text-2xl font-bold mt-4">Hydration</h3>
              <p className="text-blue-100 opacity-80 mt-2">You're 2 glasses away from your target.</p>
            </div>
            <div className="relative z-10 mt-8">
              <span className="text-4xl font-extrabold">2.1 <span className="text-lg opacity-60">/ 3.0 L</span></span>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* ═══════════════════  TODAY'S MEALS  ══════════════════════════ */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[var(--color-text)]">Today's Meals</h2>
            <button onClick={() => navigate('/log')} className="text-emerald-600 font-bold text-sm hover:underline">
              View All History
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loggedMeals.map(meal => (
              <MealImageCard key={meal.id} meal={meal} />
            ))}
            {missingMeals.map(type => (
              <EmptyMealCard key={type} type={type} onAdd={() => navigate('/scan')} />
            ))}
          </div>
        </section>

        {/* ═══════════════════  QUICK ACTIONS  ══════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <QuickAction
            icon="show_chart" title="Weekly Progress"
            desc="Deep dive into your metabolic trends and consistency scores."
            bgColor="bg-emerald-100" color="text-emerald-600"
            onClick={() => navigate('/progress')}
          />
          <QuickAction
            icon="medical_information" title="Consultations"
            desc="Schedule a 1-on-1 session with our certified nutritionists."
            bgColor="bg-blue-100" color="text-blue-600"
            onClick={() => navigate('/consultations')}
          />
          <QuickAction
            icon="account_circle" title="My Profile"
            desc="Manage your biological data, goals, and privacy settings."
            bgColor="bg-amber-100" color="text-amber-600"
            onClick={() => navigate('/profile')}
          />
        </section>

      </div>
    </Sidebar>
  )
}