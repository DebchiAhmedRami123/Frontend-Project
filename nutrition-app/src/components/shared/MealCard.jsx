/**
 * MealCard — displays a single meal entry
 */
export default function MealCard({ meal, onAdd, isEmpty = false }) {
  const mealIcons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎',
  }

  if (isEmpty) {
    return (
      <button
        onClick={onAdd}
        className="w-full group flex items-center gap-4 px-5 py-4 rounded-2xl border-2 border-dashed border-gray-200/80 bg-white/40 hover:border-[var(--color-accent)] hover:bg-white transition-all duration-200"
      >
        <div className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-[var(--color-accent)]/10 flex items-center justify-center transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-400 group-hover:text-[var(--color-text)] capitalize transition-colors">
          Add {meal}
        </span>
      </button>
    )
  }

  const totalCal = meal.items.reduce((s, i) => s + i.calories, 0)

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white shadow-sm border border-gray-100/80 hover:shadow-md transition-shadow duration-200">
      <div className="w-11 h-11 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-xl flex-shrink-0">
        {mealIcons[meal.meal_type] || '🍽️'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-text)] capitalize">
          {meal.meal_type}
        </p>
        <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
          {meal.items.map(i => i.name).join(' · ')}
        </p>
      </div>

      <div className="text-right flex-shrink-0 pl-3">
        <span className="text-sm font-bold text-[var(--color-text)]">{totalCal}</span>
        <span className="text-[11px] text-[var(--color-muted)] ml-0.5">kcal</span>
      </div>

      <button className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>
  )
}
